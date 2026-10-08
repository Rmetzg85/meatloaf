// POST /api/matches: run Phase 1 rule-based matching for the signed-in buyer.
// Uses the buyer's own access token, so Supabase RLS limits every read and write
// to their own preferences and matches. Matching only runs when they opted in.

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { runMatching } from '@/lib/matching/match'
import { zipPoint, milesBetween } from '@/lib/matching/geo'
import { RULES_VERSION, type BuyerPreferences, type Candidate } from '@/lib/matching/types'

export const dynamic = 'force-dynamic'

type SaleRow = {
  list_price: number
  is_test: boolean
  properties: {
    id: string
    address: string
    city: string
    state: string
    zip_code: string | null
    bedrooms: number | null
    bathrooms: number | null
    property_type: string | null
    status: string
  } | null
}

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !userData.user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const uid = userData.user.id

  const { data: prefs, error: prefsErr } = await supabase
    .from('buyer_preferences')
    .select('*')
    .eq('user_id', uid)
    .maybeSingle<BuyerPreferences>()
  if (prefsErr) return NextResponse.json({ error: 'Could not load preferences' }, { status: 500 })
  if (!prefs) return NextResponse.json({ status: 'no_preferences', matches: [] })
  if (!prefs.match_opt_in) return NextResponse.json({ status: 'opted_out', matches: [] })

  // Homes with a sale price. RLS: active listings, plus the owner's own TEST rows.
  const { data: rows, error: rowsErr } = await supabase
    .from('property_sale_info')
    .select('list_price, is_test, properties(id, address, city, state, zip_code, bedrooms, bathrooms, property_type, status)')
    .lte('list_price', prefs.budget_max)
    .returns<SaleRow[]>()
  if (rowsErr) return NextResponse.json({ error: 'Could not load homes' }, { status: 500 })

  const candidates: Candidate[] = (rows ?? [])
    .filter((r) => r.properties && (r.properties.status === 'active' || r.is_test))
    .map((r) => ({
      id: r.properties!.id,
      address: r.properties!.address,
      city: r.properties!.city,
      state: r.properties!.state,
      zip_code: r.properties!.zip_code,
      bedrooms: r.properties!.bedrooms,
      bathrooms: r.properties!.bathrooms == null ? null : Number(r.properties!.bathrooms),
      property_type: r.properties!.property_type,
      list_price: r.list_price,
      is_test: r.is_test,
    }))

  const run = runMatching(prefs, candidates, zipPoint, milesBetween)

  // Log this run: replace the buyer's stored matches with the new ones.
  let logged = false
  const { error: delErr } = await supabase.from('matches').delete().eq('buyer_id', uid)
  if (!delErr && run.matches.length) {
    const { error: insErr } = await supabase.from('matches').insert(
      run.matches.map((m) => ({
        buyer_id: uid,
        property_id: m.property.id,
        score: m.score,
        reasons: m.reasons,
        rules_version: RULES_VERSION,
      })),
    )
    if (insErr) console.error('matches log failed', insErr.code, insErr.message)
    else logged = true
  }

  return NextResponse.json({
    status: 'ok',
    logged,
    considered: run.considered,
    notes: run.notes,
    matches: run.matches,
  })
}
