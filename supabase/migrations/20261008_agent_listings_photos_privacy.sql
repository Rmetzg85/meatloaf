-- Agent sale listings: listing photos (table + Storage bucket) and agent email privacy.
-- Additive except for one RLS policy swap on public.profiles (no table or column changes).

-- 1) Listing photos ---------------------------------------------------------------------------
create table if not exists public.property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  -- Object path inside the listing-photos bucket: <owner uid>/<property id>/<file>
  storage_path text not null unique,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists property_photos_property_idx on public.property_photos (property_id, position);

alter table public.property_photos enable row level security;

-- Visible whenever the property itself is visible (properties RLS: active, or your own).
create policy property_photos_select_visible on public.property_photos
  for select to anon, authenticated
  using (exists (select 1 from public.properties p where p.id = property_photos.property_id));
create policy property_photos_insert_owner on public.property_photos
  for insert to authenticated
  with check (
    (select private.owns_property(property_id, (select auth.uid())))
    and split_part(storage_path, '/', 1) = (select auth.uid())::text
    and split_part(storage_path, '/', 2) = property_id::text
  );
create policy property_photos_update_owner on public.property_photos
  for update to authenticated
  using ((select private.owns_property(property_id, (select auth.uid()))))
  with check (
    (select private.owns_property(property_id, (select auth.uid())))
    and split_part(storage_path, '/', 1) = (select auth.uid())::text
    and split_part(storage_path, '/', 2) = property_id::text
  );
create policy property_photos_delete_owner on public.property_photos
  for delete to authenticated
  using ((select private.owns_property(property_id, (select auth.uid()))));

revoke insert, update, delete, truncate on public.property_photos from anon;

-- Storage bucket: public read by URL, images only, 5 MB max per file.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-photos', 'listing-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Owner-only writes, inside <uid>/<property id they own>/...
-- (No broad SELECT policy, so the bucket can't be listed; public URLs still work.
--  The owner SELECT policy is needed for the Storage API to delete/replace their own files.)
create policy listing_photos_owner_select on storage.objects
  for select to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy listing_photos_owner_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.owns_property(((storage.foldername(name))[2])::uuid, (select auth.uid())))
  );
create policy listing_photos_owner_update on storage.objects
  for update to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy listing_photos_owner_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- 2) Agent email privacy -----------------------------------------------------------------------
-- Before: anyone (incl. anon) could read the whole profile (email, credit_score, ...) of a user
-- with an active listing. Now profiles are own-row only; listing pages use the functions below.
drop policy if exists profiles_select_own_or_listing_owner on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

-- Definer logic lives in the non-exposed private schema; public wrappers are SECURITY INVOKER.
create or replace function private.listing_agent_name(p_property_id uuid)
returns text
language sql stable security definer set search_path = ''
as $$
  select pr.full_name
  from public.properties p join public.profiles pr on pr.id = p.landlord_id
  where p.id = p_property_id and p.status = 'active';
$$;

create or replace function private.listing_agent_contact(p_property_id uuid)
returns table (full_name text, email text)
language sql stable security definer set search_path = ''
as $$
  select pr.full_name, pr.email
  from public.properties p join public.profiles pr on pr.id = p.landlord_id
  where p.id = p_property_id and p.status = 'active' and (select auth.uid()) is not null;
$$;

revoke all on function private.listing_agent_name(uuid) from public;
revoke all on function private.listing_agent_contact(uuid) from public;
grant execute on function private.listing_agent_name(uuid) to anon, authenticated;
grant execute on function private.listing_agent_contact(uuid) to authenticated;

-- Public name of an active listing's agent (no email). Callable by anyone.
create or replace function public.listing_agent_name(p_property_id uuid)
returns text
language sql stable security invoker set search_path = ''
as $$ select private.listing_agent_name(p_property_id); $$;

-- Name + email of an active listing's agent. Signed-in users only.
create or replace function public.listing_agent_contact(p_property_id uuid)
returns table (full_name text, email text)
language sql stable security invoker set search_path = ''
as $$ select * from private.listing_agent_contact(p_property_id); $$;

revoke all on function public.listing_agent_name(uuid) from public;
revoke all on function public.listing_agent_contact(uuid) from public, anon;
grant execute on function public.listing_agent_name(uuid) to anon, authenticated;
grant execute on function public.listing_agent_contact(uuid) to authenticated;
