import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { userFromRequest } from '@/lib/api-auth'
import { isListablePrice, isUuid } from '@/lib/listing'
import {
  LISTING_FEE_CENTS, LISTING_FEE_CURRENCY, LISTING_FEE_PRODUCT_NAME, STATEMENT_DESCRIPTOR_SUFFIX, STRIPE_BUSINESS_TAG,
} from '@/lib/listing-fee'
import { SITE_URL } from '@/lib/site'
import { getStripe, missingStripeConfig } from '@/lib/stripe-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST { listingId, theme } -> { url } of a Stripe Checkout Session for the flat $29 listing fee.
export async function POST(req: Request) {
  const auth = await userFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  const { user, db } = auth

  const body = (await req.json().catch(() => null)) as { listingId?: unknown; theme?: unknown } | null
  const listingId = typeof body?.listingId === 'string' ? body.listingId : ''
  if (!isUuid(listingId)) return NextResponse.json({ error: 'Unknown listing.' }, { status: 400 })
  const theme = body?.theme === 'mimosa' ? 'mimosa' : 'meatloaf'

  // RLS: an agent can only read their own unpublished rows.
  const { data: listing, error } = await db
    .from('properties')
    .select('id, landlord_id, address, city, state, payment_status, property_sale_info(list_price, is_test)')
    .eq('id', listingId)
    .eq('landlord_id', user.id)
    .maybeSingle()
  if (error) {
    console.error('[checkout] listing lookup failed', error.code)
    return NextResponse.json({ error: "Couldn't load that listing. Try again." }, { status: 500 })
  }
  if (!listing) return NextResponse.json({ error: 'Unknown listing.' }, { status: 404 })
  if (listing.payment_status !== 'unpaid') return NextResponse.json({ error: 'This listing is already paid for.', alreadyPaid: true }, { status: 409 })
  const sale = (Array.isArray(listing.property_sale_info) ? listing.property_sale_info[0] : listing.property_sale_info) as
    | { list_price: number; is_test: boolean }
    | null
  if (!sale || sale.is_test || !isListablePrice(sale.list_price))
    return NextResponse.json({ error: 'Add a list price at or under $300K before paying.' }, { status: 422 })

  const missing = missingStripeConfig('checkout')
  const stripe = getStripe()
  if (missing.length || !stripe) {
    console.warn('[checkout] Stripe checkout is not configured; missing env:', missing.join(', '))
    return NextResponse.json(
      { error: 'Online payment is temporarily unavailable. Your listing is saved; please try again soon or email us.', unavailable: true },
      { status: 503 },
    )
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) console.warn('[checkout] STRIPE_WEBHOOK_SECRET missing; relying on the success-page confirm call')

  const metadata = { business: STRIPE_BUSINESS_TAG, listing_id: listing.id, agent_user_id: user.id }
  const priceId = process.env.STRIPE_PRICE_ID
  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = priceId
    ? { price: priceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: LISTING_FEE_CURRENCY,
          unit_amount: LISTING_FEE_CENTS,
          product_data: { name: LISTING_FEE_PRODUCT_NAME, metadata: { business: STRIPE_BUSINESS_TAG } },
        },
      }
  const back = `${SITE_URL}/agent/listings`
  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [lineItem],
        client_reference_id: listing.id,
        customer_email: user.email ?? undefined,
        metadata,
        payment_intent_data: {
          statement_descriptor_suffix: STATEMENT_DESCRIPTOR_SUFFIX,
          description: `Meatloaf listing: ${listing.address}, ${listing.city}, ${listing.state}`.slice(0, 300),
          metadata,
        },
        success_url: `${back}?paid=${listing.id}&session_id={CHECKOUT_SESSION_ID}&theme=${theme}`,
        cancel_url: `${back}?canceled=${listing.id}&theme=${theme}`,
      },
      // One open session per listing per 10 minutes, so double clicks don't create several.
      { idempotencyKey: `meatloaf-listing-${listing.id}-${theme}-${Math.floor(Date.now() / 600_000)}` },
    )
    if (!session.url) throw new Error('no session url')
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const e = err as { type?: string; code?: string; message?: string }
    console.error('[checkout] session create failed', e.type, e.code, e.message)
    return NextResponse.json({ error: "Couldn't start checkout. Please try again in a minute." }, { status: 502 })
  }
}
