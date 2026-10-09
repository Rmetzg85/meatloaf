-- Daily check-in: once per account per local calendar day, regardless of browser/device.
-- Additive only (new table + functions). Does not change existing homeownership_points.

-- Day boundary: the client sends its local YYYY-MM-DD. We accept it only when it falls within
-- ±1 calendar day of "today" in America/New_York (the site's timezone). That covers travelers
-- near midnight without letting anyone farm by inventing dates far in the past or future.

create table if not exists public.daily_checkins (
  user_id uuid not null references public.profiles(id) on delete cascade,
  local_date date not null,
  xp integer not null default 10 check (xp > 0 and xp <= 100),
  created_at timestamptz not null default now(),
  primary key (user_id, local_date)
);

alter table public.daily_checkins enable row level security;

-- Own rows only; no insert/update/delete policies (only the definer RPC may write).
create policy daily_checkins_select_own on public.daily_checkins
  for select to authenticated
  using (user_id = (select auth.uid()));

revoke insert, update, delete, truncate on public.daily_checkins from anon, authenticated, public;
grant select on public.daily_checkins to authenticated;

create or replace function private.claim_daily_checkin(p_local_date date)
returns table (
  awarded boolean,
  xp_awarded integer,
  homeownership_points integer,
  current_milestone text,
  local_date date
)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  uid uuid := (select auth.uid());
  v_today date := (timezone('America/New_York', now()))::date;
  v_xp integer := 10;
  v_rows integer := 0;
  v_inserted boolean := false;
  v_points integer;
  v_milestone text;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_local_date is null
     or p_local_date < (v_today - 1)
     or p_local_date > (v_today + 1) then
    raise exception 'local date out of allowed range' using errcode = '22023';
  end if;

  -- Atomic: the primary key stops a second award for the same account + day.
  insert into public.daily_checkins (user_id, local_date, xp)
  values (uid, p_local_date, v_xp)
  on conflict (user_id, local_date) do nothing;

  get diagnostics v_rows = row_count;
  v_inserted := v_rows > 0;

  if v_inserted then
    update public.profiles pr
    set
      homeownership_points = pr.homeownership_points + v_xp,
      current_milestone = case
        when pr.homeownership_points + v_xp >= 1000 then 'Ready to Buy'
        when pr.homeownership_points + v_xp >= 600 then 'Mortgage Basics Pro'
        when pr.homeownership_points + v_xp >= 300 then 'Saving for Down Payment'
        when pr.homeownership_points + v_xp >= 100 then 'Building Credit'
        else 'Getting Started'
      end,
      updated_at = now()
    where pr.id = uid
    returning pr.homeownership_points, pr.current_milestone into v_points, v_milestone;
  else
    select pr.homeownership_points, pr.current_milestone
      into v_points, v_milestone
      from public.profiles pr
      where pr.id = uid;
  end if;

  return query
    select v_inserted,
           case when v_inserted then v_xp else 0 end,
           coalesce(v_points, 0),
           coalesce(v_milestone, 'Getting Started'),
           p_local_date;
end;
$$;

revoke all on function private.claim_daily_checkin(date) from public;
grant execute on function private.claim_daily_checkin(date) to authenticated;

create or replace function public.claim_daily_checkin(p_local_date date)
returns table (
  awarded boolean,
  xp_awarded integer,
  homeownership_points integer,
  current_milestone text,
  local_date date
)
language sql
volatile
security invoker
set search_path = ''
as $$ select * from private.claim_daily_checkin(p_local_date); $$;

revoke all on function public.claim_daily_checkin(date) from public, anon;
grant execute on function public.claim_daily_checkin(date) to authenticated;
