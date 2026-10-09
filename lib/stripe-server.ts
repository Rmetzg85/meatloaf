// Server-only: imported by app/api/stripe/* route handlers only.
import Stripe from 'stripe'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { decideSession, type CheckoutSessionLike, type SessionDecision } from './listing-fee'

// Server-only Stripe + Supabase service-role helpers for the $29 listing fee.
// Env: STRIPE_SECRET_KEY (restricted live key), STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY,
// optional STRIPE_PRICE_ID (otherwise the $29 price is sent inline with each Checkout Session).

let stripeClient: Stripe | null = null
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  stripeClient ??= new Stripe(key, { appInfo: { name: 'meatloafhomes.com' }, maxNetworkRetries: 2 })
  return stripeClient
}

let serviceClient: SupabaseClient | null = null
/** Bypasses RLS. Only used to mark a listing paid after Stripe confirms the payment. */
export function getServiceSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  serviceClient ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
  return serviceClient
}

/** Which pieces are missing (names only, never values). */
// Checkout needs the secret key plus a way to publish the listing afterwards (service role);
// the webhook needs its signing secret plus the service role.
export function missingStripeConfig(kind: 'checkout' | 'webhook'): string[] {
  const need = kind === 'checkout' ? ['STRIPE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY'] : ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'SUPABASE_SERVICE_ROLE_KEY']
  return need.filter((k) => !process.env[k])
}

export type FulfillResult = { ok: true; outcome: 'marked_paid' | 'already_paid' | 'ignored' | 'waiting' | 'rejected' | 'listing_missing'; detail?: string } | { ok: false; error: string }

/**
 * Publish the listing for a paid Meatloaf Checkout Session. Idempotent: repeat events and the
 * success-page confirm call both land here, and only an 'unpaid' listing is ever changed.
 */
export async function fulfillCheckoutSession(session: CheckoutSessionLike, db: SupabaseClient): Promise<FulfillResult> {
  const d: SessionDecision = decideSession(session)
  if (d.action === 'ignore') return { ok: true, outcome: 'ignored' }
  if (d.action === 'wait') return { ok: true, outcome: 'waiting', detail: d.reason }
  if (d.action === 'reject') {
    console.error('[stripe] meatloaf session rejected', session.id, d.reason)
    return { ok: true, outcome: 'rejected', detail: d.reason }
  }

  const { data: updated, error } = await db
    .from('properties')
    .update({ payment_status: 'paid', paid_at: new Date().toISOString(), stripe_checkout_session_id: d.sessionId })
    .eq('id', d.listingId)
    .eq('landlord_id', d.agentId)
    .eq('payment_status', 'unpaid')
    .select('id')
  if (error) {
    // Unique index on stripe_checkout_session_id: the same session already paid for this row.
    if (error.code === '23505') return { ok: true, outcome: 'already_paid' }
    console.error('[stripe] mark paid failed', d.listingId, error.code, error.message)
    return { ok: false, error: 'database update failed' }
  }
  if (updated && updated.length) {
    console.info('[stripe] listing paid', d.listingId, d.sessionId)
    return { ok: true, outcome: 'marked_paid' }
  }

  const { data: row, error: readErr } = await db.from('properties').select('id, payment_status, stripe_checkout_session_id').eq('id', d.listingId).maybeSingle()
  if (readErr) return { ok: false, error: 'database read failed' }
  if (!row) {
    console.warn('[stripe] paid session for a missing listing (deleted?)', d.listingId, d.sessionId)
    return { ok: true, outcome: 'listing_missing' }
  }
  if (row.payment_status !== 'unpaid' && row.stripe_checkout_session_id && row.stripe_checkout_session_id !== d.sessionId) {
    // Paid twice (e.g. two open checkout tabs). Publishing is already done; flag it for a refund.
    console.warn('[stripe] DUPLICATE PAYMENT, refund session', d.sessionId, 'listing', d.listingId)
  }
  return { ok: true, outcome: 'already_paid' }
}
