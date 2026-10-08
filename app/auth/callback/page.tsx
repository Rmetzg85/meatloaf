// app/auth/callback/page.tsx
'use client'

// Landing page for Supabase email links (signup confirmation, resend, magic link, recovery).
// Runs in the browser because this app keeps the Supabase session in the browser client.

import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, MailWarning } from 'lucide-react'
import toast from 'react-hot-toast'
import BrandLink from '@/COMPONENTS/BrandLink'
import ResendConfirmButton from '@/COMPONENTS/ResendConfirmButton'
import { THEMES, type ThemeKey } from '@/COMPONENTS/theme'
import { SiteThemeContext, THEME_COOKIE, parseTheme, useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import { completeAuthFromUrl, ensureProfile, landingFor, takeRememberedNext, userRole } from '@/lib/auth'

function themeCookieIsSet() {
  return new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=`).test(document.cookie)
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const siteTheme = useSiteTheme()
  const themeCtx = useContext(SiteThemeContext)
  const t = THEMES[siteTheme]
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return // codes are single-use; don't run twice in dev StrictMode
    ran.current = true
    completeAuthFromUrl(window.location.href).then(async (result) => {
      if (!result.ok) {
        setError(result.message)
        return
      }
      const user = result.session.user
      if (result.recovery) {
        router.replace('/auth/reset-password')
        return
      }
      // Keep the brand they signed up on if this browser has no theme yet (e.g. link opened on another device).
      let theme: ThemeKey = siteTheme
      const signedUpOn = user.user_metadata?.site_theme as string | undefined
      if (signedUpOn && !themeCookieIsSet()) {
        theme = parseTheme(signedUpOn)
        themeCtx?.setTheme(theme)
      }
      await ensureProfile(user) // logs and continues on failure
      const role = await userRole(user)
      const next = takeRememberedNext()
      toast.success('Email confirmed. Welcome!')
      router.replace(next ?? landingFor(role, theme))
    })
  }, [router, siteTheme, themeCtx])

  return (
    <div className={`min-h-screen ${t.sectionBg} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <BrandLink className="inline-flex items-center space-x-2 mb-6" size={48} imgClassName="w-12 h-auto" nameClassName="text-3xl font-bold text-gray-900" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {!error ? (
            <div role="status" aria-live="polite">
              <Loader2 className={`w-10 h-10 animate-spin mx-auto mb-4 ${t.accentText}`} aria-hidden="true" />
              <h1 className="text-xl font-bold text-gray-900">Confirming your account...</h1>
            </div>
          ) : (
            <div role="alert">
              <MailWarning className="w-12 h-12 mx-auto mb-4 text-amber-500" aria-hidden="true" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">That link didn&apos;t work</h1>
              <p className="text-gray-700 text-sm mb-1">{error}</p>
              <p className="text-gray-600 text-sm mb-6">Links expire and can only be used once. Enter your email and we&apos;ll send a fresh confirmation link.</p>
              <label htmlFor="resend-email" className="sr-only">Email address</label>
              <input
                id="resend-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <ResendConfirmButton email={email} className={`w-full ${t.gradient} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition`} />
              <p className="mt-6 text-sm text-gray-600">
                Already confirmed?{' '}
                <Link href="/auth/login" className={`${t.labelText} font-semibold hover:underline`}>Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
