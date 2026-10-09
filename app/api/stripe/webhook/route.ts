import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { fulfillCheckoutSession, getPaymentDb, getStripe, missingStripeConfig } from '@/lib/stripe-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Stripe -> https://www.meatloafhomes.com/api/stripe/webhook
// Events: checkout.session.completed, checkout.session.async_payment_succeeded.
// The Stripe account is shared with Stacked Work: anything without metadata.business=meatloaf is acknowledged and ignored.
export async function POST(req: Request) {
  const missing = missingStripeConfig('webhook')
  const stripe = getStripe()
  const db = getPaymentDb()
  if (missing.length || !stripe || !db) {
    console.warn('[stripe-webhook] not configured; missing env:', missing.join(', '))
    return NextResponse.json({ error: 'not configured' }, { status: 503 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'missing signature' }, { status: 400 })
  const payload = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.warn('[stripe-webhook] bad signature', (err as Error).message)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return NextResponse.json({ received: true, ignored: event.type })
  }
  const session = event.data.object as Stripe.Checkout.Session
  const result = await fulfillCheckoutSession(
    { ...session, metadata: (session.metadata ?? null) as Record<string, string> | null },
    db,
  )
  // 500 only on our own database errors, so Stripe retries; everything else is acknowledged.
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json({ received: true, outcome: result.outcome })
}
