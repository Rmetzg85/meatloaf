// Client-side auth helpers shared by signup, login, the auth callback and SiteNav.
import type { EmailOtpType, Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { THEMES, type ThemeKey } from '@/COMPONENTS/theme'

const FALLBACK_SITE_URL = 'https://www.meatloaf.rent'

/** Origin for auth email links: this tab's origin, else NEXT_PUBLIC_SITE_URL, else www.meatloaf.rent. */
export function siteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin
  return (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, '')
}

/** Where confirmation emails send people back to. Must be in Supabase Auth's Redirect URLs list. */
export const authCallbackUrl = () => `${siteOrigin()}/auth/callback`
export const passwordResetUrl = () => `${siteOrigin()}/auth/reset-password`

/**
 * One landing place per role, used by signup, login, /auth/callback and SiteNav.
 * Agents: the "List a Home" (#agents) section of their brand's homepage.
 * Legacy landlord/lender accounts: /landlord/dashboard. Everyone else: /dashboard.
 */
export function landingFor(userType: string | null | undefined, theme: ThemeKey): string {
  if (userType === 'realestateagent') return `${THEMES[theme].home}#agents`
  if (userType === 'landlord' || userType === 'lender') return '/landlord/dashboard'
  return '/dashboard'
}

export function isEmailNotConfirmed(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null
  return e?.code === 'email_not_confirmed' || /email not confirmed/i.test(e?.message ?? '')
}

/** Friendlier text for the auth errors people actually hit. */
export function authErrorMessage(err: unknown, fallback: string): string {
  const e = err as { code?: string; message?: string; status?: number } | null
  const msg = e?.message ?? ''
  if (e?.code === 'over_email_send_rate_limit' || e?.status === 429 || /rate limit|security purposes/i.test(msg)) {
    return 'Too many emails were sent just now. Please wait a minute and try again.'
  }
  return msg || fallback
}

export function resendConfirmation(email: string) {
  return supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: authCallbackUrl() } })
}

/** Role for a user: profile row first, then the signup metadata. */
export async function userRole(user: User): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('user_type').eq('id', user.id).maybeSingle()
  if (error) console.warn('[auth] profile lookup failed', error)
  return (data?.user_type as string | undefined) ?? (user.user_metadata?.user_type as string | undefined) ?? null
}

/**
 * Make sure a profile row exists (the DB trigger normally creates it).
 * Never overwrites an existing profile, and never throws: errors are logged and it resolves false.
 */
export async function ensureProfile(user: User): Promise<boolean> {
  try {
    const meta = user.user_metadata ?? {}
    const { error } = await supabase.from('profiles').upsert(
      { id: user.id, email: user.email, full_name: meta.full_name ?? null, user_type: meta.user_type ?? 'future homeowner' },
      { onConflict: 'id', ignoreDuplicates: true },
    )
    if (error) {
      console.warn('[auth] profile upsert skipped', error)
      return false
    }
    return true
  } catch (err) {
    console.warn('[auth] profile upsert failed', err)
    return false
  }
}

export type CallbackResult =
  | { ok: true; session: Session; recovery: boolean }
  | { ok: false; message: string }

/**
 * Finish an email link (confirm signup, magic link, recovery) for this app's browser client.
 * Handles ?code= (PKCE), ?token_hash=&type= (custom email templates), and #access_token= (implicit,
 * the supabase-js default, which the client picks up on its own), plus ?error= / #error=.
 */
export async function completeAuthFromUrl(href: string): Promise<CallbackResult> {
  const url = new URL(href)
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''))
  const q = url.searchParams
  const errText = q.get('error_description') || hash.get('error_description') || q.get('error') || hash.get('error')
  if (errText) return { ok: false, message: errText.replace(/\+/g, ' ') }

  const type = (q.get('type') || hash.get('type')) as EmailOtpType | null
  const recovery = type === 'recovery'
  const code = q.get('code')
  const tokenHash = q.get('token_hash')

  if (code || (tokenHash && type)) {
    const { data, error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: type! })
    if (data?.session) return { ok: true, session: data.session, recovery }
    // The client may already have consumed the link during init (or on a refresh).
    const existing = (await supabase.auth.getSession()).data.session
    if (existing) return { ok: true, session: existing, recovery }
    return { ok: false, message: error?.message || 'This link is invalid or has expired.' }
  }
  // Implicit flow: supabase-js reads #access_token during init; getSession waits for that.
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) return { ok: false, message: error?.message || 'This link is invalid or has expired.' }
  return { ok: true, session: data.session, recovery }
}
