// Offline check of /api/stripe/webhook: real signature verification, mock PostgREST. Run: npx tsx scripts/test-stripe-webhook.mts
import http from 'node:http'
import Stripe from 'stripe'

const LISTING = '11111111-1111-4111-8111-111111111111'
const AGENT = '22222222-2222-4222-8222-222222222222'
let rowState: 'unpaid' | 'paid' = 'unpaid'
const calls: string[] = []
const server = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    calls.push(`${req.method} ${decodeURIComponent(req.url!)} ${body}`)
    res.setHeader('content-type', 'application/json')
    if (req.method === 'PATCH') {
      const matches = req.url!.includes('payment_status=eq.unpaid') && rowState === 'unpaid'
      if (matches) rowState = 'paid'
      res.end(JSON.stringify(matches ? [{ id: LISTING }] : []))
    } else {
      res.end(JSON.stringify({ id: LISTING, payment_status: rowState, stripe_checkout_session_id: 'cs_test_A' }))
    }
  })
})
await new Promise<void>((r) => server.listen(54329, r))
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54329'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-test'
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret'

const { POST } = await import('../app/api/stripe/webhook/route')
const stripe = new Stripe('sk_test_dummy')

function evt(type: string, session: Record<string, unknown>) {
  return JSON.stringify({ id: 'evt_' + Math.random(), object: 'event', type, data: { object: { object: 'checkout.session', ...session } } })
}
async function send(payload: string, secret = 'whsec_test_secret') {
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret })
  const res = await POST(new Request('http://x/api/stripe/webhook', { method: 'POST', body: payload, headers: { 'stripe-signature': header } }))
  return `${res.status} ${JSON.stringify(await res.json())}`
}
const good = { id: 'cs_test_A', mode: 'payment', payment_status: 'paid', amount_total: 2900, currency: 'usd', client_reference_id: LISTING, metadata: { business: 'meatloaf', listing_id: LISTING, agent_user_id: AGENT } }
const results: [string, string, RegExp][] = []
const check = async (name: string, p: Promise<string>, expect: RegExp) => results.push([name, await p, expect])

await check('bad signature', send(evt('checkout.session.completed', good), 'whsec_wrong'), /^400/)
await check('stacked work session ignored', send(evt('checkout.session.completed', { ...good, metadata: { plan: 'pro' } })), /^200 .*ignored/)
await check('other event type ignored', send(evt('payment_intent.succeeded', good)), /^200 .*ignored/)
await check('async pending waits', send(evt('checkout.session.completed', { ...good, payment_status: 'unpaid' })), /^200 .*waiting/)
await check('wrong amount rejected', send(evt('checkout.session.completed', { ...good, amount_total: 100 })), /^200 .*rejected/)
await check('mismatched client_reference_id rejected', send(evt('checkout.session.completed', { ...good, client_reference_id: AGENT })), /^200 .*rejected/)
const patchesBefore = calls.filter((c) => c.startsWith('PATCH')).length
await check('paid -> marked_paid', send(evt('checkout.session.completed', good)), /^200 .*marked_paid/)
await check('replay -> already_paid (idempotent)', send(evt('checkout.session.completed', good)), /^200 .*already_paid/)
await check('async_payment_succeeded replay', send(evt('checkout.session.async_payment_succeeded', good)), /^200 .*already_paid/)
const patch = calls.filter((c) => c.startsWith('PATCH'))[patchesBefore]
results.push(['PATCH filters', patch, /id=eq\.1111.*landlord_id=eq\.2222.*payment_status=eq\.unpaid|payment_status=eq\.unpaid/])
delete process.env.STRIPE_WEBHOOK_SECRET
await check('missing secret -> 503', send(evt('checkout.session.completed', good)), /^503/)

let fails = 0
for (const [n, out, re] of results) { const ok = re.test(out); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', n, '=>', out.slice(0, 220)) }
server.close()
process.exit(fails ? 1 : 0)
