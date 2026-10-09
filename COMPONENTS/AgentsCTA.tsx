'use client'

import Link from 'next/link'
import { THEMES, CONTACT_EMAIL, type ThemeKey } from './theme'
import { useAuthState } from './useAuthState'
import { canListHomes } from '@/lib/auth'

/**
 * Call to action in the homepage #agents section.
 * Signed-in agents go straight to their listing tools; buyers and signed-out visitors get the pitch.
 */
export default function AgentsCTA({ theme }: { theme: ThemeKey }) {
  const t = THEMES[theme]
  const auth = useAuthState()
  const btn = `inline-block ${t.gradient} text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition`

  if (auth.status === 'in' && canListHomes(auth.role)) {
    return (
      <div data-testid="agents-cta-agent">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/agent/listings" className={btn}>Go to My Listings</Link>
          <Link
            href="/agent/listings/new"
            className={`inline-block bg-white border-2 ${t.accentBorder} ${t.labelText} px-8 py-[14px] rounded-lg font-bold text-lg hover:opacity-90 transition`}
          >
            Create a listing
          </Link>
        </div>
        <p className="text-gray-600 text-sm mt-4">Online listing checkout is coming soon. Nothing is charged when you publish.</p>
      </div>
    )
  }

  // Hidden (but laid out) until the session is known, so agents don't see the sign-up pitch flash.
  return (
    <div data-testid="agents-cta-public" className={auth.status === 'unknown' ? 'invisible' : ''}>
      <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('List a home (founding rate)')}`} className={btn}>
        List a Home
      </a>
      <p className="text-gray-700 mt-5">
        Already have a Real Estate Agent account?{' '}
        <Link href="/agent/listings/new" className={`${t.labelText} font-semibold underline hover:no-underline`}>Create your listing</Link>
        {' '}or{' '}
        <Link href={`/auth/signup?role=agent&next=${encodeURIComponent('/agent/listings/new')}`} className={`${t.labelText} font-semibold underline hover:no-underline`}>sign up as an agent</Link>.
      </p>
      <p className="text-gray-600 text-sm mt-4">Online listing checkout is coming soon. Email us to reserve the founding rate.</p>
    </div>
  )
}
