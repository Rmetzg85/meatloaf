'use client'

export const dynamic = 'force-dynamic'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Bath, Bed, Loader2, Lock, MapPin, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import SiteNav from '@/COMPONENTS/SiteNav'
import SiteFooter from '@/COMPONENTS/SiteFooter'
import { THEMES } from '@/COMPONENTS/theme'
import { useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import { MATCH_UI } from '@/COMPONENTS/matching/ui'
import type { MatchResult } from '@/lib/matching/types'

type State =
  | { kind: 'loading' }
  | { kind: 'signed_out' }
  | { kind: 'no_preferences' }
  | { kind: 'opted_out' }
  | { kind: 'error' }
  | { kind: 'ok'; matches: MatchResult[]; notes: string[]; considered: number }

async function fetchMatches(): Promise<State> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { kind: 'signed_out' }
  try {
    const res = await fetch('/api/matches', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } })
    const body = await res.json()
    if (!res.ok) return { kind: 'error' }
    if (body.status === 'no_preferences') return { kind: 'no_preferences' }
    if (body.status === 'opted_out') return { kind: 'opted_out' }
    return { kind: 'ok', matches: body.matches ?? [], notes: body.notes ?? [], considered: body.considered ?? 0 }
  } catch {
    return { kind: 'error' }
  }
}

export default function MatchesPage() {
  const theme = useSiteTheme()
  const t = THEMES[theme]
  const ui = MATCH_UI[theme]
  const [state, setState] = useState<State>({ kind: 'loading' })

  const load = useCallback(() => {
    setState({ kind: 'loading' })
    fetchMatches().then(setState)
  }, [])

  useEffect(() => {
    let live = true
    fetchMatches().then((s) => { if (live) setState(s) })
    return () => { live = false }
  }, [])

  const optOut = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('buyer_preferences').update({ match_opt_in: false, opt_in_at: null }).eq('user_id', user.id)
    await supabase.from('matches').delete().eq('buyer_id', user.id)
    if (error) return toast.error('Could not turn off matching.')
    toast.success('Matching is off. Your saved matches were cleared.')
    setState({ kind: 'opted_out' })
  }

  const box = `${ui.card} p-8 text-center space-y-4`

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <SiteNav theme={theme} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your <span className={t.gradientText}>matches</span></h1>
            <p className="text-gray-600 mt-2">Ranked by the preferences you gave us, and nothing else.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/preferences" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50">
              <SlidersHorizontal size={16} /> Edit preferences
            </Link>
            {state.kind === 'ok' && (
              <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50">
                <RefreshCw size={16} /> Refresh
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          {state.kind === 'loading' && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={32} /></div>}

          {state.kind === 'signed_out' && (
            <div className={box}>
              <Lock className="mx-auto text-gray-400" />
              <p className="text-gray-700">Log in to see homes matched to your preferences.</p>
              <Link href="/auth/login" className={`inline-block ${t.gradient} text-white px-5 py-2 rounded-lg font-semibold`}>Log in</Link>
            </div>
          )}

          {state.kind === 'no_preferences' && (
            <div className={box}>
              <p className="text-gray-700">Tell us your budget and where you are, then turn on matching.</p>
              <Link href="/preferences" className={`inline-block ${t.gradient} text-white px-5 py-2 rounded-lg font-semibold`}>Set preferences</Link>
            </div>
          )}

          {state.kind === 'opted_out' && (
            <div className={box}>
              <p className="text-gray-700">Matching is off. We don’t run matches unless you turn it on.</p>
              <Link href="/preferences" className={`inline-block ${t.gradient} text-white px-5 py-2 rounded-lg font-semibold`}>Turn on matching</Link>
            </div>
          )}

          {state.kind === 'error' && (
            <div className={box}>
              <p className="text-gray-700">Something went wrong loading your matches.</p>
              <button onClick={load} className={ui.link}>Try again</button>
            </div>
          )}

          {state.kind === 'ok' && (
            <div className="space-y-4">
              {state.notes.map((n) => (
                <p key={n} className={`text-sm rounded-lg px-3 py-2 ${ui.badge}`}>{n}</p>
              ))}
              {state.matches.length === 0 ? (
                <div className={box}>
                  <p className="text-gray-700">No homes fit all of your preferences yet. Try a wider area or a different budget, or check back as new homes are added.</p>
                </div>
              ) : (
                state.matches.map((m, i) => (
                  <article key={m.property.id} className={`${ui.card} p-5 flex flex-col sm:flex-row gap-4`}>
                    <div className={`shrink-0 w-12 h-12 rounded-full ${t.gradient} text-white flex items-center justify-center font-bold`}>#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{m.property.address}</h2>
                        <span className={`text-xl font-bold ${t.accentText}`}>${m.property.list_price.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-600 flex items-center gap-1 text-sm"><MapPin size={14} /> {m.property.city}, {m.property.state} {m.property.zip_code ?? ''}</p>
                      <div className="flex gap-4 text-sm text-gray-700 mt-1">
                        {m.property.bedrooms != null && <span className="flex items-center gap-1"><Bed size={14} /> {m.property.bedrooms} bd</span>}
                        {m.property.bathrooms != null && <span className="flex items-center gap-1"><Bath size={14} /> {m.property.bathrooms} ba</span>}
                        {m.property.is_test && <span className="px-2 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">TEST LISTING</span>}
                      </div>
                      <p className="text-sm text-gray-800 mt-3"><span className="font-semibold">Why it matches:</span> {m.reasons.join(' · ')}</p>
                    </div>
                  </article>
                ))
              )}
              <p className="text-xs text-gray-500 pt-2">
                Matches use only your stated budget, size, location and commute settings. Commute is estimated by straight-line distance.
                Transit, walkability and school-rating data are coming soon. Listings may be inaccurate or unavailable.
              </p>
              <button onClick={optOut} className="text-sm text-gray-600 underline hover:text-gray-900">Turn off matching</button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter theme={theme} />
    </div>
  )
}
