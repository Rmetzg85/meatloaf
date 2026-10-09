-- Mark a listing paid without a Supabase service-role key.
-- The Stripe webhook / confirm routes (server-only) call public.mark_listing_paid() with the anon key plus an
-- `x-meatloaf-payment-secret` request header. The function compares the header's SHA-256 to a hash kept in
-- private.billing_settings (not exposed through the API). No valid header -> 42501, nothing changes.
-- The secret travels in a header, not an argument, so it never appears in SQL statement text or logs.

create extension if not exists pgcrypto with schema extensions;

alter table private.billing_settings add column if not exists payment_rpc_secret_sha256 text;

create or replace function private.mark_listing_paid(p_listing_id uuid, p_agent_id uuid, p_session_id text)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  hdr text := nullif(current_setting('request.headers', true), '')::json ->> 'x-meatloaf-payment-secret';
  expected text;
begin
  select payment_rpc_secret_sha256 into expected from private.billing_settings where id;
  if expected is null or hdr is null or length(hdr) < 32
     or encode(extensions.digest(hdr, 'sha256'), 'hex') <> expected then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_session_id is null or p_session_id !~ '^cs_(live|test)_[A-Za-z0-9]+$' then
    raise exception 'bad session id' using errcode = '22023';
  end if;

  begin
    update public.properties
       set payment_status = 'paid', paid_at = now(), stripe_checkout_session_id = p_session_id
     where id = p_listing_id and landlord_id = p_agent_id and payment_status = 'unpaid';
    if found then return 'marked_paid'; end if;
  exception when unique_violation then
    return 'already_paid'; -- this session already paid for a listing
  end;

  if not exists (select 1 from public.properties where id = p_listing_id) then return 'listing_missing'; end if;
  if exists (select 1 from public.properties where id = p_listing_id and payment_status = 'unpaid') then
    return 'agent_mismatch'; -- still unpaid, but the session's agent doesn't own it: don't publish
  end if;
  if exists (select 1 from public.properties where id = p_listing_id and payment_status = 'paid'
             and stripe_checkout_session_id is distinct from p_session_id) then
    return 'duplicate_payment'; -- paid twice (e.g. two checkout tabs): refund this session
  end if;
  return 'already_paid';
end;
$$;
revoke all on function private.mark_listing_paid(uuid, uuid, text) from public;
grant execute on function private.mark_listing_paid(uuid, uuid, text) to anon, authenticated;

-- API entry point. Callable by anyone, but it only does something with the server-only secret header.
create or replace function public.mark_listing_paid(p_listing_id uuid, p_agent_id uuid, p_session_id text)
returns text
language sql volatile security invoker set search_path = ''
as $$ select private.mark_listing_paid(p_listing_id, p_agent_id, p_session_id); $$;
revoke all on function public.mark_listing_paid(uuid, uuid, text) from public;
grant execute on function public.mark_listing_paid(uuid, uuid, text) to anon, authenticated;
