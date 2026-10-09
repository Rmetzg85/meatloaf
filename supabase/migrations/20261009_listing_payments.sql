-- $29 agent listing fee (Stripe Checkout).
-- New listings start 'unpaid' and stay hidden from the public until the Stripe webhook marks them 'paid'.
-- Existing listings are grandfathered. While private.billing_settings.listing_fee_required is false (the
-- default, until Stripe keys + webhook are live), new listings are 'waived', i.e. today's free behavior.
-- Additive: new columns, one settings table, a guard trigger, and visibility rules that also require payment.

-- 1) Columns ------------------------------------------------------------------------------------
-- Existing rows are filled with 'grandfathered' by the column default (no UPDATE, so updated_at is untouched);
-- the default then switches to 'unpaid' for anything inserted afterwards.
alter table public.properties
  add column if not exists payment_status text not null default 'grandfathered',
  add column if not exists stripe_checkout_session_id text,
  add column if not exists paid_at timestamptz;

do $$ begin
  alter table public.properties
    add constraint properties_payment_status_check
    check (payment_status in ('unpaid', 'paid', 'waived', 'grandfathered'));
exception when duplicate_object then null; end $$;

create unique index if not exists properties_stripe_checkout_session_idx
  on public.properties (stripe_checkout_session_id) where stripe_checkout_session_id is not null;

alter table public.properties alter column payment_status set default 'unpaid';

-- 2) Kill switch ----------------------------------------------------------------------------------
create table if not exists private.billing_settings (
  id boolean primary key default true check (id),
  listing_fee_required boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into private.billing_settings (id) values (true) on conflict (id) do nothing;
revoke all on private.billing_settings from public, anon, authenticated;

create or replace function private.listing_fee_required()
returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce((select listing_fee_required from private.billing_settings where id), false); $$;
revoke all on function private.listing_fee_required() from public;
grant execute on function private.listing_fee_required() to anon, authenticated;

-- Public wrapper so the app can tell agents whether checkout is on.
create or replace function public.listing_fee_required()
returns boolean
language sql stable security invoker set search_path = ''
as $$ select private.listing_fee_required(); $$;
revoke all on function public.listing_fee_required() from public;
grant execute on function public.listing_fee_required() to anon, authenticated;

-- 3) Agents can't mark their own listing paid ---------------------------------------------------
-- SECURITY INVOKER on purpose: current_user is the API role (anon/authenticated) for browser requests,
-- and service_role / postgres for the Stripe webhook and migrations, which may set these columns.
create or replace function private.properties_guard_payment()
returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.payment_status := case when private.listing_fee_required() then 'unpaid' else 'waived' end;
    new.stripe_checkout_session_id := null;
    new.paid_at := null;
  else
    new.payment_status := old.payment_status;
    new.stripe_checkout_session_id := old.stripe_checkout_session_id;
    new.paid_at := old.paid_at;
  end if;
  return new;
end;
$$;
revoke all on function private.properties_guard_payment() from public;

drop trigger if exists properties_guard_payment on public.properties;
create trigger properties_guard_payment
  before insert or update on public.properties
  for each row execute function private.properties_guard_payment();

-- 4) Public = active AND paid (or waived/grandfathered). Owners still see all of their own rows. ----
create or replace function private.is_published(p_status text, p_payment_status text)
returns boolean
language sql immutable set search_path = ''
as $$ select p_status = 'active' and p_payment_status in ('paid', 'waived', 'grandfathered'); $$;
grant execute on function private.is_published(text, text) to anon, authenticated;

drop policy if exists properties_select_active_or_own on public.properties;
create policy properties_select_published_or_own on public.properties
  for select to anon, authenticated
  using (private.is_published(status, payment_status) or landlord_id = (select auth.uid()));

create or replace function private.has_active_listing(profile_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.properties p
                 where p.landlord_id = profile_id and private.is_published(p.status, p.payment_status));
$$;

create or replace function private.listing_agent_name(p_property_id uuid)
returns text
language sql stable security definer set search_path = ''
as $$
  select pr.full_name
  from public.properties p join public.profiles pr on pr.id = p.landlord_id
  where p.id = p_property_id and private.is_published(p.status, p.payment_status);
$$;

create or replace function private.listing_agent_contact(p_property_id uuid)
returns table (full_name text, email text)
language sql stable security definer set search_path = ''
as $$
  select pr.full_name, pr.email
  from public.properties p join public.profiles pr on pr.id = p.landlord_id
  where p.id = p_property_id and private.is_published(p.status, p.payment_status) and (select auth.uid()) is not null;
$$;
