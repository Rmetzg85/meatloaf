import { NextResponse } from 'next/server'
import { userFromRequest } from '@/lib/api-auth'
import { fulfillCheckoutSession, getPaymentDb, getStripe } from '@/lib/stripe-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST { sessionId } from the checkout success page. Asks Stripe directly (never trusts the browser) and
// publishes the listing if the webhook hasn't yet. Safe to call repeatedly.
export async function POST(req: Request) {
  const auth = await userFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  const body = (await req.json().catch(() => null)) as { sessionId?: unknown } | null
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : ''
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(sessionId)) return NextResponse.json({ error: 'bad session' }, { status: 400 })

  const stripe = getStripe()
  const db = getPaymentDb()
  if (!stripe || !db) return NextResponse.json({ outcome: 'unavailable' }, { status: 503 })
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.metadata?.agent_user_id !== auth.user.id) return NextResponse.json({ error: 'not your session' }, { status: 403 })
    const result = await fulfillCheckoutSession({ ...session, metadata: (session.metadata ?? null) as Record<string, string> | null }, db)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json({ outcome: result.outcome })
  } catch (err) {
    console.error('[stripe-confirm] failed', (err as Error).message)
    return NextResponse.json({ error: 'lookup failed' }, { status: 502 })
  }
}
