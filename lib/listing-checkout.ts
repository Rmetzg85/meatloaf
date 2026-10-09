// Browser helpers for the $29 listing checkout.
import { supabase } from './supabase'
import type { ThemeKey } from '@/COMPONENTS/theme'

async function authedPost(path: string, body: unknown) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return { ok: false as const, status: 401, json: { error: 'Please sign in again.' } as Record<string, unknown> }
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = ((await res.json().catch(() => ({}))) ?? {}) as Record<string, unknown>
  return { ok: res.ok, status: res.status, json }
}

/** Sends the browser to Stripe Checkout. Resolves with an error message only if that wasn't possible. */
export async function startListingCheckout(listingId: string, theme: ThemeKey): Promise<{ error: string; alreadyPaid?: boolean } | null> {
  try {
    const r = await authedPost('/api/stripe/checkout', { listingId, theme })
    if (r.ok && typeof r.json.url === 'string') {
      window.location.assign(r.json.url)
      return null
    }
    return { error: (r.json.error as string) || "Couldn't start checkout. Please try again.", alreadyPaid: !!r.json.alreadyPaid }
  } catch {
    return { error: "Couldn't reach checkout. Check your connection and try again." }
  }
}

/** After Stripe redirects back: make sure the listing is published even if the webhook is slow. */
export async function confirmListingCheckout(sessionId: string): Promise<string | null> {
  try {
    const r = await authedPost('/api/stripe/confirm', { sessionId })
    return typeof r.json.outcome === 'string' ? r.json.outcome : null
  } catch {
    return null
  }
}

/** Whether the $29 fee is switched on (database setting). Defaults to false on error: free listing, as before. */
export async function listingFeeRequired(): Promise<boolean> {
  const { data, error } = await supabase.rpc('listing_fee_required')
  if (error) console.warn('[listing] fee flag lookup failed', error.code)
  return data === true
}
