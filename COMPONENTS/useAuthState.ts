'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { userRole } from '@/lib/auth'

export type AuthState = { status: 'unknown' | 'out' } | { status: 'in'; role: string | null }

/** Signed-in state + role, kept in sync with Supabase auth (used by the header and the #agents CTA). */
export function useAuthState(): AuthState {
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
