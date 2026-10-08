-- AI matching, Phase 1: buyer preferences, rule-based matches, sale price for listings.
-- Additive only: creates new tables, does not alter or drop existing ones.
-- Fair Housing: no protected-class fields, no neighborhood demographic/crime data.

-- 1) Buyer preferences: one row per buyer, linked to profiles.
create table public.buyer_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  budget_max integer not null check (budget_max > 0 and budget_max <= 300000),
  min_beds smallint check (min_beds between 0 and 10),
  min_baths numeric(3,1) check (min_baths between 0 and 10),
  current_city text check (char_length(current_city) <= 80),
  current_state text not null check (current_state ~ '^[A-Z]{2}$'),
  current_zip text check (current_zip ~ '^[0-9]{5}$'),
  move_scope text check (move_scope in ('stay_local','within_miles','specific_places','anywhere')),
  move_radius_miles integer check (move_radius_miles between 1 and 3000),
  move_states text[] check (move_states is null or cardinality(move_states) <= 60),
  move_cities text[] check (move_cities is null or cardinality(move_cities) <= 30),
  remote_work text check (remote_work in ('full_remote','hybrid','not_remote')),
  office_days_per_week smallint check (office_days_per_week between 1 and 5),
  office_city text check (char_length(office_city) <= 80),
  office_state text check (office_state ~ '^[A-Z]{2}$'),
  office_zip text check (office_zip ~ '^[0-9]{5}$'),
  max_commute_minutes smallint check (max_commute_minutes between 10 and 180),
  needs_transit boolean,
  wants_walkable boolean,
  school_ratings_matter boolean,
  timeline text check (timeline in ('under_3_months','3_6_months','6_12_months','just_looking')),
  match_opt_in boolean not null default false,
  opt_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_preferences_location_chk check (current_city is not null or current_zip is not null)
);

create trigger buyer_preferences_set_updated_at
  before update on public.buyer_preferences
  for each row execute function public.set_updated_at();

alter table public.buyer_preferences enable row level security;

create policy buyer_preferences_select_own on public.buyer_preferences
  for select to authenticated using (user_id = (select auth.uid()));
create policy buyer_preferences_insert_own on public.buyer_preferences
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy buyer_preferences_update_own on public.buyer_preferences
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy buyer_preferences_delete_own on public.buyer_preferences
  for delete to authenticated using (user_id = (select auth.uid()));

revoke all on public.buyer_preferences from anon;

-- 2) Matches: buyer, property, score, reasons (from the buyer's own criteria only).
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.buyer_preferences(user_id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  score numeric(6,2) not null,
  reasons text[] not null default '{}',
  rules_version text not null default 'phase1-v1',
  created_at timestamptz not null default now(),
  unique (buyer_id, property_id)
);

create index matches_buyer_score_idx on public.matches (buyer_id, score desc);
create index matches_property_id_idx on public.matches (property_id);

alter table public.matches enable row level security;

create policy matches_select_own on public.matches
  for select to authenticated using (buyer_id = (select auth.uid()));
create policy matches_insert_own on public.matches
  for insert to authenticated with check (buyer_id = (select auth.uid()));
create policy matches_update_own on public.matches
  for update to authenticated using (buyer_id = (select auth.uid())) with check (buyer_id = (select auth.uid()));
create policy matches_delete_own on public.matches
  for delete to authenticated using (buyer_id = (select auth.uid()));

revoke all on public.matches from anon;

-- 3) Sale details for listings (properties only has monthly_rent).
--    Separate table so existing tables stay untouched. is_test marks seed data.
create table public.property_sale_info (
  property_id uuid primary key references public.properties(id) on delete cascade,
  list_price integer not null check (list_price > 0),
  is_test boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger property_sale_info_set_updated_at
  before update on public.property_sale_info
  for each row execute function public.set_updated_at();

alter table public.property_sale_info enable row level security;

-- Readable whenever the underlying property is readable (properties RLS applies in the subquery).
create policy property_sale_info_select_visible on public.property_sale_info
  for select to anon, authenticated
  using (exists (select 1 from public.properties p where p.id = property_sale_info.property_id));
create policy property_sale_info_insert_owner on public.property_sale_info
  for insert to authenticated with check ((select private.owns_property(property_id, (select auth.uid()))) and is_test = false);
create policy property_sale_info_update_owner on public.property_sale_info
  for update to authenticated using ((select private.owns_property(property_id, (select auth.uid()))))
  with check ((select private.owns_property(property_id, (select auth.uid()))) and is_test = false);
create policy property_sale_info_delete_owner on public.property_sale_info
  for delete to authenticated using ((select private.owns_property(property_id, (select auth.uid()))));

revoke insert, update, delete, truncate on public.property_sale_info from anon;
