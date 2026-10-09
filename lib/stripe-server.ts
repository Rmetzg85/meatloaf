// Server-only: imported by app/api/stripe/* route handlers only.
import Stripe from 'stripe'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { decideSession, type CheckoutSessionLike, type SessionDecision } from './listing-fee'

// Server-only Stripe helpers for the $29 listing fee.
// Env: STRIPE_SECRET_KEY (restricted live key), STRIPE_WEBHOOK_SECRET, LISTING_PAYMENT_SECRET (server-only
// secret that lets these routes call public.mark_listing_paid), optional STRIPE_PRICE_ID (otherwise the
// $29 price is sent inline with each Checkout Session). No Supabase service-role key is needed.

let stripeClient: Stripe | null = null
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  stripeClient ??= new Stripe(key, { appInfo: { name: 'meatloafhomes.com' }, maxNetworkRetries: 2 })
  return stripeClient
}

let paymentClient: SupabaseClient | null = null
/**
 * Anon-key client that sends the server-only `x-meatloaf-payment-secret` header. Its only extra power is
 * public.mark_listing_paid(), which checks that header's hash in the database; RLS applies to everything else.
 */
export function getPaymentDb(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const secret = process.env.LISTING_PAYMENT_SECRET
  if (!url || !anon || !secret) return null
  paymentClient ??= createClient(url, anon, {
    global: { headers: { 'x-meatloaf-payment-secret': secret } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return paymentClient
}

/** Which pieces are missing (names only, never values). */
export function missingStripeConfig(kind: 'checkout' | 'webhook'): string[] {
  const need = kind === 'checkout' ? ['STRIPE_SECRET_KEY', 'LISTING_PAYMENT_SECRET'] : ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'LISTING_PAYMENT_SECRET']
  return need.filter((k) => !process.env[k])
}

export type FulfillOutcome = 'marked_paid' | 'already_paid' | 'duplicate_payment' | 'ignored' | 'waiting' | 'rejected' | 'listing_missing'
export type FulfillResult = { ok: true; outcome: FulfillOutcome; detail?: string } | { ok: false; error: string }

/**
 * Publish the listing for a paid Meatloaf Checkout Session. Idempotent: repeat events and the
 * success-page confirm call both land here, and the database only ever changes an 'unpaid' listing.
 */
export async function fulfillCheckoutSession(session: CheckoutSessionLike, db: SupabaseClient): Promise<FulfillResult> {
  const d: SessionDecision = decideSession(session)
  if (d.action === 'ignore') return { ok: true, outcome: 'ignored' }
  if (d.action === 'wait') return { ok: true, outcome: 'waiting', detail: d.reason }
  if (d.action === 'reject') {
    console.error('[stripe] meatloaf session rejected', session.id, d.reason)
    return { ok: true, outcome: 'rejected', detail: d.reason }
  }

  const { data, error } = await db.rpc('mark_listing_paid', { p_listing_id: d.listingId, p_agent_id: d.agentId, p_session_id: d.sessionId })
  if (error) {
    console.error('[stripe] mark_listing_paid failed', d.listingId, error.code, error.message)
    return { ok: false, error: 'database update failed' }
  }
  switch (data) {
    case 'marked_paid':
      console.info('[stripe] listing paid', d.listingId, d.sessionId)
      return { ok: true, outcome: 'marked_paid' }
    case 'already_paid':
      return { ok: true, outcome: 'already_paid' }
    case 'duplicate_payment':
      // Paid twice (e.g. two open checkout tabs). Already published; this session should be refunded.
      console.warn('[stripe] DUPLICATE PAYMENT, refund session', d.sessionId, 'listing', d.listingId)
      return { ok: true, outcome: 'duplicate_payment' }
    case 'listing_missing':
      console.warn('[stripe] paid session for a missing listing (deleted?)', d.listingId, d.sessionId)
      return { ok: true, outcome: 'listing_missing' }
    default:
      console.error('[stripe] listing not marked paid', d.listingId, d.sessionId, data)
      return { ok: true, outcome: 'rejected', detail: String(data) }
  }
}
