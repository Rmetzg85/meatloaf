// The flat $29 agent listing fee. Shared by the browser and the server; no secrets here.
// RESPA: one flat advertising fee per listing. No referral, lender or per-lead payments.

export const LISTING_FEE_CENTS = 2900
export const LISTING_FEE_CURRENCY = 'usd'
export const LISTING_FEE_LABEL = '$29'
export const LISTING_FEE_PRODUCT_NAME = 'Meatloaf agent listing'
/** The Stripe account is shared with Stacked Work; everything Meatloaf creates carries this tag. */
export const STRIPE_BUSINESS_TAG = 'meatloaf'
/** Card statements read "REMVENTR* MEATLOAF" (account prefix + this suffix). */
export const STATEMENT_DESCRIPTOR_SUFFIX = 'MEATLOAF'

/** payment_status values that may be shown publicly (with status = 'active'). */
export const PUBLISHED_PAYMENT_STATUSES = ['paid', 'waived', 'grandfathered'] as const

export type PaymentStatus = 'unpaid' | 'paid' | 'waived' | 'grandfathered'

/** Mirrors private.is_published() in the database. */
export const isPublished = (status: string | null | undefined, payment: string | null | undefined) =>
  status === 'active' && (payment === 'paid' || payment === 'waived' || payment === 'grandfathered')

/** Minimal shape of a Stripe Checkout Session that the fulfillment logic looks at. */
export interface CheckoutSessionLike {
  id: string
  mode?: string | null
  status?: string | null
  payment_status?: string | null
  amount_total?: number | null
  currency?: string | null
  client_reference_id?: string | null
  metadata?: Record<string, string> | null
}

export type SessionDecision =
  | { action: 'ignore'; reason: string }
  | { action: 'wait'; reason: string }
  | { action: 'reject'; reason: string }
  | { action: 'mark_paid'; listingId: string; agentId: string; sessionId: string }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * What to do with a completed Checkout Session. Pure, so it's easy to check.
 * - ignore: not Meatloaf's (Stacked Work shares the account) -> acknowledge and do nothing.
 * - wait: Meatloaf's, but the money hasn't settled (async methods) -> acknowledge, a later event finishes it.
 * - reject: tagged Meatloaf but malformed or the wrong amount -> acknowledge, log loudly, don't publish.
 * - mark_paid: publish the listing.
 */
export function decideSession(s: CheckoutSessionLike): SessionDecision {
  const md = s.metadata ?? {}
  if (md.business !== STRIPE_BUSINESS_TAG) return { action: 'ignore', reason: 'not a meatloaf session' }
  const listingId = md.listing_id ?? ''
  const agentId = md.agent_user_id ?? ''
  if (!UUID_RE.test(listingId) || !UUID_RE.test(agentId)) return { action: 'reject', reason: 'missing listing_id/agent_user_id metadata' }
  if (s.client_reference_id && s.client_reference_id !== listingId) return { action: 'reject', reason: 'client_reference_id does not match listing_id' }
  if (s.mode && s.mode !== 'payment') return { action: 'reject', reason: `unexpected mode ${s.mode}` }
  if (s.payment_status !== 'paid') return { action: 'wait', reason: `payment_status=${s.payment_status ?? 'unknown'}` }
  if (s.amount_total !== LISTING_FEE_CENTS || (s.currency ?? '').toLowerCase() !== LISTING_FEE_CURRENCY)
    return { action: 'reject', reason: `unexpected amount ${s.amount_total} ${s.currency}` }
  return { action: 'mark_paid', listingId, agentId, sessionId: s.id }
}
