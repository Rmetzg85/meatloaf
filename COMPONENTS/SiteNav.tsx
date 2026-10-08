'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import { THEMES, type ThemeKey } from './theme'
import { useSiteTheme } from './useSiteTheme'
import { supabase } from '@/lib/supabase'
import { canListHomes, landingFor, userRole } from '@/lib/auth'

type AuthState = { status: 'unknown' | 'out' } | { status: 'in'; role: string | null }

// Signed-in state for the header: Dashboard + Log out instead of Login + Play Free.
function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({ status: 'unknown' })
  useEffect(() => {
    let alive = true
    const apply = (user: User | null) => {
      if (!user) { if (alive) setState({ status: 'out' }); return }
      setState({ status: 'in', role: (user.user_metadata?.user_type as string | undefined) ?? null })
      userRole(user).then((role) => { if (alive) setState({ status: 'in', role }) })
    }
    supabase.auth.getSession().then(({ data }) => apply(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer: supabase-js warns against awaiting other calls inside this callback.
      setTimeout(() => apply(session?.user ?? null), 0)
    })
    return () => { alive = false; sub.subscription.unsubscribe() }
  }, [])
  return state
}

// Pass `theme` on brand pages; leave it out to follow the visitor's site theme.
export default function SiteNav({ theme, active }: { theme?: ThemeKey; active?: 'about' }) {
  const siteTheme = useSiteTheme()
  const themeKey = theme ?? siteTheme
  const t = THEMES[themeKey]
  const router = useRouter()
  const auth = useAuthState()
  const [open, setOpen] = useState(false)
  const signedIn = auth.status === 'in'

  const links = [
    { href: '/properties', label: 'Homes Under $300K' },
    { href: `${t.home}#credit-game`, label: 'The Credit Game' },
    { href: `${t.home}#path`, label: 'The Path' },
    { href: t.about, label: 'About', key: 'about' },
    // Signed-in agents get their listing tools; everyone else sees the agent pitch.
    signedIn && canListHomes(auth.role)
      ? { href: '/agent/listings', label: 'My Listings' }
      : { href: `${t.home}#agents`, label: 'List a Home (Agents)' },
  ]
  const account = signedIn
    ? { href: landingFor(auth.role, themeKey), label: 'Dashboard' }
    : { href: '/auth/login', label: 'Login' }

  const logOut = async () => {
    setOpen(false)
    const { error } = await supabase.auth.signOut()
    if (error) { toast.error('Failed to log out'); return }
    toast.success('Logged out')
    router.push(t.home)
  }

  // Hide the account controls until we know the session, so they don't flash.
  const authCls = auth.status === 'unknown' ? 'invisible' : ''
  const ctaCls = `${t.gradient} text-white rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap`

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link href={t.home} className="flex items-center space-x-2 shrink-0">
            <Image src={t.logo} alt={t.name} width={40} height={40} className="h-10 w-auto" />
            <span className={t.brandText}>{t.name}</span>
          </Link>
          {/* Full link row only at xl+; below that it collapses into the menu so nothing wraps. */}
          <div className="hidden xl:flex items-center gap-5">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`whitespace-nowrap text-sm ${active && l.key === active ? 'text-gray-900 font-bold' : 'text-gray-700 hover:text-gray-900 font-medium'}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href={account.href} className={`whitespace-nowrap text-sm text-gray-700 hover:text-gray-900 font-medium ${authCls}`}>
              {account.label}
            </Link>
            <Link href={t.switchHref} className="whitespace-nowrap text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-50 transition">
              {t.switchLabel}
            </Link>
            {signedIn ? (
              <button type="button" onClick={logOut} className={`${ctaCls} px-5 py-2`}>Log out</button>
            ) : (
              <Link href="/auth/signup" className={`${ctaCls} px-5 py-2 ${authCls}`}>Play Free</Link>
            )}
          </div>
          <button
            className="xl:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-nav-menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div id="site-nav-menu" className="xl:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col space-y-3">
          {[...links, account].map((l) => (
            <Link key={l.label} href={l.href} className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href={t.switchHref} className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-2 rounded-full hover:bg-pink-50 transition text-center" onClick={() => setOpen(false)}>
            {t.switchLabel}
          </Link>
          {signedIn ? (
            <button type="button" onClick={logOut} className={`${ctaCls} px-6 py-3 text-center`}>Log out</button>
          ) : (
            <Link href="/auth/signup" className={`${ctaCls} px-6 py-3 text-center`} onClick={() => setOpen(false)}>
              Play Free
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
