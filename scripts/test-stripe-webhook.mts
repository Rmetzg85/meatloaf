// Offline check of /api/stripe/webhook: real signature verification, mock PostgREST. Run: npx tsx scripts/test-stripe-webhook.mts
import http from 'node:http'
import Stripe from 'stripe'

const LISTING = '11111111-1111-4111-8111-111111111111'
const AGENT = '22222222-2222-4222-8222-222222222222'
let paidBy: string | null = null
const calls: string[] = []
// Mock of PostgREST's /rpc/mark_listing_paid, including the secret-header check the database does.
const server = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    calls.push(`${req.method} ${req.url} secret=${req.headers['x-meatloaf-payment-secret'] === 'payment-secret-for-tests-0123456789' ? 'ok' : 'missing'} ${body}`)
    res.setHeader('content-type', 'application/json')
    if (req.headers['x-meatloaf-payment-secret'] !== 'payment-secret-for-tests-0123456789') {
      res.statusCode = 401
      return res.end(JSON.stringify({ code: '42501', message: 'forbidden' }))
    }
    const a = JSON.parse(body)
    let out = 'already_paid'
    if (a.p_agent_id !== AGENT) out = 'agent_mismatch'
    else if (!paidBy) { paidBy = a.p_session_id; out = 'marked_paid' }
    else if (paidBy !== a.p_session_id) out = 'duplicate_payment'
    res.end(JSON.stringify(out))
  })
})
await new Promise<void>((r) => server.listen(54329, r))
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54329'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-test'
process.env.LISTING_PAYMENT_SECRET = 'payment-secret-for-tests-0123456789'
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
await check('paid -> marked_paid', send(evt('checkout.session.completed', good)), /^200 .*marked_paid/)
await check('replay -> already_paid (idempotent)', send(evt('checkout.session.completed', good)), /^200 .*already_paid/)
await check('async_payment_succeeded replay', send(evt('checkout.session.async_payment_succeeded', good)), /^200 .*already_paid/)
await check('second session -> duplicate_payment', send(evt('checkout.session.completed', { ...good, id: 'cs_test_B' })), /^200 .*duplicate_payment/)
await check('agent mismatch not published', send(evt('checkout.session.completed', { ...good, id: 'cs_test_C', metadata: { ...good.metadata, agent_user_id: '33333333-3333-4333-8333-333333333333' } })), /^200 .*rejected/)
const rpc = calls.find((c) => c.includes('/rpc/mark_listing_paid')) ?? ''
results.push(['RPC call carries secret header + args', rpc, /POST \/rest\/v1\/rpc\/mark_listing_paid secret=ok .*p_listing_id.*1111.*p_agent_id.*2222.*cs_test_A/])
process.env.LISTING_PAYMENT_SECRET = 'payment-secret-for-tests-0123456789'
delete process.env.STRIPE_WEBHOOK_SECRET
await check('missing secret -> 503', send(evt('checkout.session.completed', good)), /^503/)

let fails = 0
for (const [n, out, re] of results) { const ok = re.test(out); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', n, '=>', out.slice(0, 220)) }
server.close()
process.exit(fails ? 1 : 0)
