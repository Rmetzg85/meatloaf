-- House Hop leaderboard. Scores and nicknames only; no emails or real names.
-- The table is locked down (RLS on, no policies, no grants); all access goes
-- through the SECURITY DEFINER functions below.

create table if not exists public.house_hop_scores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  best_score integer not null default 0 check (best_score between 0 and 2000),
  last_submit_at timestamptz,
  updated_at timestamptz not null default now()
);
create unique index if not exists house_hop_scores_nickname_ci on public.house_hop_scores (lower(nickname));
create index if not exists house_hop_scores_best on public.house_hop_scores (best_score desc, updated_at asc);
alter table public.house_hop_scores enable row level security;
revoke all on public.house_hop_scores from anon, authenticated;

create or replace function private.house_hop_default_nick(p_uid uuid)
returns text language sql immutable set search_path = '' as $$
  select 'Doodle #' || lpad(((('x' || substr(md5(p_uid::text), 1, 8))::bit(32)::int & 2147483647) % 10000)::text, 4, '0')
$$;

create or replace function private.house_hop_nick_ok(p_name text)
returns boolean language plpgsql immutable set search_path = '' as $$
declare
  squashed text := regexp_replace(translate(lower(p_name), '013457@$', 'oieastas'), '[^a-z]', '', 'g');
  bad text;
begin
  if p_name !~ '^[A-Za-z0-9][A-Za-z0-9 _.-]{1,14}[A-Za-z0-9]$' then return false; end if;
  foreach bad in array array['fuck','shit','bitch','cunt','dick','cock','pussy','asshole','nigg','fag','slut','whore','rape','nazi','hitler','porn','penis','vagina','retard','kike','spic','chink','twat','wank','admin','meatloaf','mimosa','support'] loop
    if position(bad in squashed) > 0 then return false; end if;
  end loop;
  return true;
end $$;

-- Submit a finished run. Keeps the best score per user.
create or replace function public.submit_house_hop_score(p_score integer, p_duration_ms integer)
returns json language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  row public.house_hop_scores;
  nick text;
begin
  if uid is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if p_score is null or p_score < 0 or p_score > 2000 then raise exception 'score out of range' using errcode = '22023'; end if;
  if p_duration_ms is null or p_duration_ms < 0 or p_duration_ms > 7200000 then raise exception 'bad duration' using errcode = '22023'; end if;
  -- At least ~0.4s per house (one bounce is ~1s at 60fps).
  if p_score > 0 and p_duration_ms < p_score * 400 then raise exception 'implausible run' using errcode = '22023'; end if;

  select * into row from public.house_hop_scores where user_id = uid for update;
  if found and row.last_submit_at > now() - interval '5 seconds' then
    raise exception 'too many submits, wait a few seconds' using errcode = '54000';
  end if;

  if not found then
    nick := private.house_hop_default_nick(uid);
    while exists (select 1 from public.house_hop_scores where lower(nickname) = lower(nick)) loop
      nick := 'Doodle #' || lpad((floor(random() * 10000))::int::text, 4, '0');
    end loop;
    insert into public.house_hop_scores (user_id, nickname, best_score, last_submit_at, updated_at)
      values (uid, nick, p_score, now(), now()) returning * into row;
  else
    update public.house_hop_scores
      set last_submit_at = now(),
          best_score = greatest(best_score, p_score),
          updated_at = case when p_score > best_score then now() else updated_at end
      where user_id = uid returning * into row;
  end if;

  return json_build_object('best', row.best_score, 'nickname', row.nickname,
    'rank', (select count(*) + 1 from public.house_hop_scores s where s.best_score > row.best_score));
end $$;

create or replace function public.set_house_hop_nickname(p_name text)
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); n text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
begin
  if uid is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if not private.house_hop_nick_ok(n) then raise exception 'Nickname must be 3-16 letters/numbers and family friendly' using errcode = '22023'; end if;
  if exists (select 1 from public.house_hop_scores where lower(nickname) = lower(n) and user_id <> uid) then
    raise exception 'That nickname is taken' using errcode = '23505';
  end if;
  insert into public.house_hop_scores (user_id, nickname) values (uid, n)
    on conflict (user_id) do update set nickname = excluded.nickname;
  return n;
end $$;

-- Public top 10 (nickname + score only).
create or replace function public.get_house_hop_leaderboard()
returns table (rank bigint, nickname text, best_score integer, is_me boolean)
language sql stable security definer set search_path = '' as $$
  select rank() over (order by s.best_score desc), s.nickname, s.best_score, s.user_id = auth.uid()
  from public.house_hop_scores s where s.best_score > 0
  order by s.best_score desc, s.updated_at asc limit 10
$$;

create or replace function public.get_my_house_hop_rank()
returns table (rank bigint, nickname text, best_score integer, players bigint)
language sql stable security definer set search_path = '' as $$
  select (select count(*) + 1 from public.house_hop_scores o where o.best_score > s.best_score),
         s.nickname, s.best_score,
         (select count(*) from public.house_hop_scores where best_score > 0)
  from public.house_hop_scores s where s.user_id = auth.uid()
$$;

revoke all on function public.submit_house_hop_score(integer, integer), public.set_house_hop_nickname(text),
  public.get_house_hop_leaderboard(), public.get_my_house_hop_rank() from public, anon;
grant execute on function public.submit_house_hop_score(integer, integer), public.set_house_hop_nickname(text),
  public.get_my_house_hop_rank() to authenticated;
grant execute on function public.get_house_hop_leaderboard() to anon, authenticated;
revoke all on function private.house_hop_default_nick(uuid), private.house_hop_nick_ok(text) from public, anon, authenticated;
