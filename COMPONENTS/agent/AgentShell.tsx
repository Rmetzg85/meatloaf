'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { Loader2, ShieldAlert } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import SiteNav from '../SiteNav'
import SiteFooter from '../SiteFooter'
import { THEMES, CONTACT_EMAIL } from '../theme'
import { useSiteTheme } from '../useSiteTheme'
import { supabase } from '@/lib/supabase'
import { canListHomes, userRole } from '@/lib/auth'

type Gate = { status: 'loading' } | { status: 'out' } | { status: 'forbidden' } | { status: 'ok'; user: User }

/** Signed-in agent (or other listing role) or nothing. Signed-out visitors go to login and come back. */
export function useListingAgent(): Gate {
  const router = useRouter()
  const pathname = usePathname()
  const [gate, setGate] = useState<Gate>({ status: 'loading' })
  useEffect(() => {
    let alive = true
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (!user) {
        if (alive) setGate({ status: 'out' })
        router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`)
        return
      }
      const role = await userRole(user)
      if (alive) setGate(canListHomes(role) ? { status: 'ok', user } : { status: 'forbidden' })
    })
    return () => { alive = false }
  }, [router, pathname])
  return gate
}

export default function AgentShell({ children }: { children: (user: User) => ReactNode }) {
  const t = THEMES[useSiteTheme()]
  const gate = useListingAgent()
  return (
    <div className={`min-h-screen flex flex-col ${t.sectionBg}`}>
      <SiteNav />
      <main className="flex-1">
        {gate.status === 'ok' ? (
          children(gate.user)
        ) : gate.status === 'forbidden' ? (
          <div className="max-w-xl mx-auto px-4 py-20 text-center">
            <div className={`w-14 h-14 rounded-full ${t.gradient} flex items-center justify-center mx-auto mb-5`}>
              <ShieldAlert className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing tools are for Real Estate Agent accounts</h1>
            <p className="text-gray-700 mb-6">
              You&apos;re signed in with a Future Homeowner account. Agents who want to list a home under $300K can{' '}
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Agent account')}`} className={`${t.labelText} font-semibold underline`}>email us</a>{' '}
              or create a separate Real Estate Agent account.
            </p>
            <Link href="/properties" className={`inline-block ${t.gradient} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition`}>
              Browse homes
            </Link>
          </div>
        ) : (
          <div className="flex justify-center py-24" role="status" aria-label="Loading">
            <Loader2 className={`w-10 h-10 animate-spin ${t.accentText}`} aria-hidden="true" />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
