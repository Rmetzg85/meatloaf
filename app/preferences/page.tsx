'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, Lock, Sparkles, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import SiteNav from '@/COMPONENTS/SiteNav'
import SiteFooter from '@/COMPONENTS/SiteFooter'
import { THEMES } from '@/COMPONENTS/theme'
import { useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import { MATCH_UI } from '@/COMPONENTS/matching/ui'
import { US_STATES, defaultCommuteMinutes, type MoveScope, type RemoteWork, type Timeline } from '@/lib/matching/types'

type YesNo = '' | 'yes' | 'no'

type Form = {
  budget_max: string
  min_beds: string
  min_baths: string
  current_city: string
  current_state: string
  current_zip: string
  move_scope: MoveScope
  move_radius_miles: string
  move_states: string
  move_cities: string
  remote_work: RemoteWork | ''
  office_days_per_week: string
  office_city: string
  office_state: string
  office_zip: string
  max_commute_minutes: string
  needs_transit: YesNo
  wants_walkable: YesNo
  school_ratings_matter: YesNo
  timeline: Timeline | ''
  match_opt_in: boolean
}

const EMPTY: Form = {
  budget_max: '', min_beds: '', min_baths: '', current_city: '', current_state: '', current_zip: '',
  move_scope: 'stay_local', move_radius_miles: '50', move_states: '', move_cities: '',
  remote_work: '', office_days_per_week: '2', office_city: '', office_state: '', office_zip: '', max_commute_minutes: '',
  needs_transit: '', wants_walkable: '', school_ratings_matter: '', timeline: '', match_opt_in: false,
}

const yn = (b: boolean | null | undefined): YesNo => (b == null ? '' : b ? 'yes' : 'no')
const toBool = (v: YesNo) => (v === '' ? null : v === 'yes')
const toInt = (v: string) => (v.trim() === '' ? null : Math.round(Number(v)))
const STATE_CODES = Object.keys(US_STATES)

export default function PreferencesPage() {
  const theme = useSiteTheme()
  const t = THEMES[theme]
  const ui = MATCH_UI[theme]
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasRow, setHasRow] = useState(false)
  const [savedOptIn, setSavedOptIn] = useState(false)
  const [form, setForm] = useState<Form>(EMPTY)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)
      const { data } = await supabase.from('buyer_preferences').select('*').eq('user_id', user.id).maybeSingle()
      if (data) {
        setHasRow(true)
        setSavedOptIn(!!data.match_opt_in)
        setForm({
          budget_max: String(data.budget_max ?? ''),
          min_beds: data.min_beds == null ? '' : String(data.min_beds),
          min_baths: data.min_baths == null ? '' : String(Number(data.min_baths)),
          current_city: data.current_city ?? '',
          current_state: data.current_state ?? '',
          current_zip: data.current_zip ?? '',
          move_scope: data.move_scope ?? 'stay_local',
          move_radius_miles: data.move_radius_miles == null ? '50' : String(data.move_radius_miles),
          move_states: (data.move_states ?? []).join(', '),
          move_cities: (data.move_cities ?? []).join('\n'),
          remote_work: data.remote_work ?? '',
          office_days_per_week: data.office_days_per_week == null ? '2' : String(data.office_days_per_week),
          office_city: data.office_city ?? '',
          office_state: data.office_state ?? '',
          office_zip: data.office_zip ?? '',
          max_commute_minutes: data.max_commute_minutes == null ? '' : String(data.max_commute_minutes),
          needs_transit: yn(data.needs_transit),
          wants_walkable: yn(data.wants_walkable),
          school_ratings_matter: yn(data.school_ratings_matter),
          timeline: data.timeline ?? '',
          match_opt_in: !!data.match_opt_in,
        })
      }
      setLoading(false)
    })()
  }, [])

  const commuteDefault = useMemo(() => defaultCommuteMinutes(toInt(form.office_days_per_week)), [form.office_days_per_week])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    const budget = toInt(form.budget_max)
    if (!budget || budget <= 0) return toast.error('Add your budget.')
    if (budget > 300000) return toast.error('Budget can be up to $300,000.')
    if (!form.current_state) return toast.error('Pick the state you live in now.')
    if (!form.current_city.trim() && !form.current_zip.trim()) return toast.error('Add your current city or ZIP.')
    for (const z of [form.current_zip, form.office_zip]) {
      if (z.trim() && !/^\d{5}$/.test(z.trim())) return toast.error('ZIP codes should be 5 digits.')
    }
    const moveStates = form.move_states.split(/[\s,]+/).map((s) => s.trim().toUpperCase()).filter(Boolean)
    const badState = moveStates.find((s) => !US_STATES[s])
    if (badState) return toast.error(`"${badState}" isn't a state code. Use two letters, like OH.`)
    const moveCities = form.move_cities.split('\n').map((s) => s.trim()).filter(Boolean)
    if (moveCities.some((c) => !/^[^,]+,\s*[A-Za-z]{2}$/.test(c))) return toast.error('Write cities as "City, ST", one per line.')
    if (form.move_scope === 'specific_places' && !moveStates.length && !moveCities.length) {
      return toast.error('Add at least one state or city you would move to.')
    }

    const hybrid = form.remote_work === 'hybrid'
    const row = {
      user_id: userId,
      budget_max: budget,
      min_beds: toInt(form.min_beds),
      min_baths: form.min_baths === '' ? null : Number(form.min_baths),
      current_city: form.current_city.trim() || null,
      current_state: form.current_state,
      current_zip: form.current_zip.trim() || null,
      move_scope: form.move_scope,
      move_radius_miles: form.move_scope === 'within_miles' ? toInt(form.move_radius_miles) : null,
      move_states: form.move_scope === 'specific_places' ? moveStates : null,
      move_cities: form.move_scope === 'specific_places' ? moveCities.map((c) => c.replace(/,\s*([A-Za-z]{2})$/, (_, s) => `, ${s.toUpperCase()}`)) : null,
      remote_work: form.remote_work || null,
      office_days_per_week: hybrid ? toInt(form.office_days_per_week) : null,
      office_city: hybrid ? form.office_city.trim() || null : null,
      office_state: hybrid ? form.office_state || null : null,
      office_zip: hybrid ? form.office_zip.trim() || null : null,
      max_commute_minutes: hybrid ? toInt(form.max_commute_minutes) : null,
      needs_transit: toBool(form.needs_transit),
      wants_walkable: toBool(form.wants_walkable),
      school_ratings_matter: toBool(form.school_ratings_matter),
      timeline: form.timeline || null,
      match_opt_in: form.match_opt_in,
      opt_in_at: form.match_opt_in ? (savedOptIn ? undefined : new Date().toISOString()) : null,
    }
    setSaving(true)
    const { error } = await supabase.from('buyer_preferences').upsert(row, { onConflict: 'user_id' })
    if (!error && !form.match_opt_in) await supabase.from('matches').delete().eq('buyer_id', userId)
    setSaving(false)
    if (error) return toast.error('Could not save. Please check your answers and try again.')
    setHasRow(true)
    setSavedOptIn(form.match_opt_in)
    toast.success(form.match_opt_in ? 'Saved. Matching is on.' : 'Saved. Matching is off.')
  }

  const turnOff = async () => {
    if (!userId) return
    const { error } = await supabase.from('buyer_preferences').update({ match_opt_in: false, opt_in_at: null }).eq('user_id', userId)
    await supabase.from('matches').delete().eq('buyer_id', userId)
    if (error) return toast.error('Could not turn off matching.')
    set('match_opt_in', false)
    setSavedOptIn(false)
    toast.success('Matching is off. Your saved matches were cleared.')
  }

  const deleteAll = async () => {
    if (!userId) return
    if (!window.confirm('Delete your preferences and match history? This cannot be undone.')) return
    const { error } = await supabase.from('buyer_preferences').delete().eq('user_id', userId)
    if (error) return toast.error('Could not delete your preferences.')
    setForm(EMPTY)
    setHasRow(false)
    setSavedOptIn(false)
    toast.success('Your preferences and match history were deleted.')
  }

  const label = 'block text-sm font-semibold text-gray-800 mb-1'
  const hint = 'text-xs text-gray-500 mt-1'
  const section = `${ui.card} p-6 space-y-4`
  const radio = (on: boolean) => `flex items-start gap-3 rounded-lg border px-3 py-2 cursor-pointer ${on ? ui.chipOn : 'border-gray-200 bg-white text-gray-800'}`

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <SiteNav theme={theme} />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          What are you <span className={t.gradientText}>looking for?</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Only your budget and location are required. We match homes using just what you tell us here.
        </p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
        ) : !userId ? (
          <div className={`${section} mt-8 text-center`}>
            <Lock className="mx-auto text-gray-400" />
            <p className="text-gray-700">Log in to save your home preferences.</p>
            <div className="flex justify-center gap-3">
              <Link href="/auth/login" className={`${t.gradient} text-white px-5 py-2 rounded-lg font-semibold`}>Log in</Link>
              <Link href="/auth/signup" className="px-5 py-2 rounded-lg font-semibold border border-gray-300 text-gray-800">Sign up free</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={save} className="mt-8 space-y-6">
            <section className={section}>
              <h2 className="text-lg font-bold text-gray-900">Budget and size</h2>
              <div>
                <label className={label} htmlFor="budget">Budget, up to $300K <span className="text-red-500">*</span></label>
                <input id="budget" type="number" inputMode="numeric" min={1} max={300000} required
                  className={ui.input} placeholder="250000" value={form.budget_max} onChange={(e) => set('budget_max', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label} htmlFor="beds">Min bedrooms</label>
                  <select id="beds" className={ui.input} value={form.min_beds} onChange={(e) => set('min_beds', e.target.value)}>
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="baths">Min bathrooms</label>
                  <select id="baths" className={ui.input} value={form.min_baths} onChange={(e) => set('min_baths', e.target.value)}>
                    <option value="">Any</option>
                    {[1, 1.5, 2, 2.5, 3].map((n) => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className={section}>
              <h2 className="text-lg font-bold text-gray-900">Where you are now <span className="text-red-500">*</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={label} htmlFor="city">City</label>
                  <input id="city" className={ui.input} value={form.current_city} onChange={(e) => set('current_city', e.target.value)} placeholder="Columbus" />
                </div>
                <div>
                  <label className={label} htmlFor="state">State</label>
                  <select id="state" className={ui.input} value={form.current_state} onChange={(e) => set('current_state', e.target.value)} required>
                    <option value="">Pick one</option>
                    {STATE_CODES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="zip">ZIP</label>
                  <input id="zip" inputMode="numeric" maxLength={5} className={ui.input} value={form.current_zip} onChange={(e) => set('current_zip', e.target.value)} placeholder="43215" />
                </div>
              </div>
              <p className={hint}>City or ZIP, plus state. A ZIP lets us match by miles.</p>
            </section>

            <section className={section}>
              <h2 className="text-lg font-bold text-gray-900">How far would you move?</h2>
              <div className="space-y-2">
                {([
                  ['stay_local', 'Stay local', 'About 25 miles from your ZIP'],
                  ['within_miles', 'Within a set distance', 'You pick the miles'],
                  ['specific_places', 'Specific states or cities', 'Only the places you list'],
                  ['anywhere', 'Anywhere', 'Any area in the US'],
                ] as const).map(([v, title, sub]) => (
                  <label key={v} className={radio(form.move_scope === v)}>
                    <input type="radio" name="move_scope" className={`${ui.check} mt-1`} checked={form.move_scope === v} onChange={() => set('move_scope', v)} />
                    <span><span className="font-semibold">{title}</span><span className="block text-xs text-gray-500">{sub}</span></span>
                  </label>
                ))}
              </div>
              {form.move_scope === 'within_miles' && (
                <div>
                  <label className={label} htmlFor="radius">Miles from your ZIP</label>
                  <input id="radius" type="number" min={1} max={3000} className={ui.input} value={form.move_radius_miles} onChange={(e) => set('move_radius_miles', e.target.value)} />
                </div>
              )}
              {form.move_scope === 'specific_places' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label} htmlFor="mstates">States (two-letter codes)</label>
                    <input id="mstates" className={ui.input} value={form.move_states} onChange={(e) => set('move_states', e.target.value)} placeholder="OH, PA, IN" />
                  </div>
                  <div>
                    <label className={label} htmlFor="mcities">Cities, one per line</label>
                    <textarea id="mcities" rows={3} className={ui.input} value={form.move_cities} onChange={(e) => set('move_cities', e.target.value)} placeholder={'Pittsburgh, PA\nDayton, OH'} />
                  </div>
                </div>
              )}
            </section>

            <section className={section}>
              <h2 className="text-lg font-bold text-gray-900">Work</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  ['full_remote', 'Full-time remote'],
                  ['hybrid', 'Hybrid'],
                  ['not_remote', 'Not remote'],
                ] as const).map(([v, title]) => (
                  <label key={v} className={radio(form.remote_work === v)}>
                    <input type="radio" name="remote_work" className={`${ui.check} mt-1`} checked={form.remote_work === v} onChange={() => set('remote_work', v)} />
                    <span className="font-semibold">{title}</span>
                  </label>
                ))}
              </div>
              {form.remote_work === 'full_remote' && <p className={hint}>We won’t limit by commute. Any area you’d move to counts.</p>}
              {form.remote_work === 'hybrid' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={label} htmlFor="days">Office days per week</label>
                      <select id="days" className={ui.input} value={form.office_days_per_week} onChange={(e) => set('office_days_per_week', e.target.value)}>
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={label} htmlFor="commute">Longest one-way commute (minutes)</label>
                      <input id="commute" type="number" min={10} max={180} className={ui.input} value={form.max_commute_minutes} placeholder={`${commuteDefault} (default)`} onChange={(e) => set('max_commute_minutes', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={label} htmlFor="ocity">Office city</label>
                      <input id="ocity" className={ui.input} value={form.office_city} onChange={(e) => set('office_city', e.target.value)} />
                    </div>
                    <div>
                      <label className={label} htmlFor="ostate">Office state</label>
                      <select id="ostate" className={ui.input} value={form.office_state} onChange={(e) => set('office_state', e.target.value)}>
                        <option value="">Pick one</option>
                        {STATE_CODES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={label} htmlFor="ozip">Office ZIP</label>
                      <input id="ozip" inputMode="numeric" maxLength={5} className={ui.input} value={form.office_zip} onChange={(e) => set('office_zip', e.target.value)} />
                    </div>
                  </div>
                  <p className={hint}>
                    For now we estimate commute by straight-line distance from your office ZIP (about half a mile per minute).
                    Defaults: 90 minutes for 1 day a week, 60 for 2–3 days, 45 for 4 or more.
                  </p>
                </div>
              )}
            </section>

            <section className={section}>
              <h2 className="text-lg font-bold text-gray-900">Nice to have</h2>
              <p className={`text-sm rounded-lg px-3 py-2 ${ui.badge}`}>
                Coming soon: transit, walkability and school-rating data. We save your answers now but don’t use them for matching yet.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {([
                  ['needs_transit', 'Need public transit?'],
                  ['wants_walkable', 'Want walkable shopping and entertainment?'],
                  ['school_ratings_matter', 'Do school ratings matter to you?'],
                ] as const).map(([k, q]) => (
                  <div key={k}>
                    <label className={label} htmlFor={k}>{q}</label>
                    <select id={k} className={ui.input} value={form[k]} onChange={(e) => set(k, e.target.value as YesNo)}>
                      <option value="">No answer</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className={label} htmlFor="timeline">When do you want to buy?</label>
                <select id="timeline" className={ui.input} value={form.timeline} onChange={(e) => set('timeline', e.target.value as Timeline | '')}>
                  <option value="">No answer</option>
                  <option value="under_3_months">In the next 3 months</option>
                  <option value="3_6_months">3 to 6 months</option>
                  <option value="6_12_months">6 to 12 months</option>
                  <option value="just_looking">Just looking</option>
                </select>
              </div>
            </section>

            <section className={section}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className={`${ui.check} mt-1`} checked={form.match_opt_in} onChange={(e) => set('match_opt_in', e.target.checked)} />
                <span className="text-gray-900 font-semibold">Match me with homes (and later, agents) that fit what I’m looking for.</span>
              </label>
              <p className={hint}>Matching only runs while this is checked. You can turn it off or delete your answers any time.</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className={`${t.gradient} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60`}>
                  {saving ? 'Saving…' : 'Save preferences'}
                </button>
                {hasRow && savedOptIn && (
                  <Link href="/matches" className={`inline-flex items-center gap-1 ${ui.link}`}><Sparkles size={16} /> See your matches</Link>
                )}
              </div>
            </section>

            {hasRow && (
              <section className={`${ui.card} p-6 space-y-3`}>
                <h2 className="text-lg font-bold text-gray-900">Your data</h2>
                <div className="flex flex-wrap gap-3">
                  {savedOptIn && (
                    <button type="button" onClick={turnOff} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50">
                      Turn off matching
                    </button>
                  )}
                  <button type="button" onClick={deleteAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 font-semibold hover:bg-red-50">
                    <Trash2 size={16} /> Delete my preferences
                  </button>
                </div>
                <p className={hint}>Deleting removes your answers and your match history.</p>
              </section>
            )}
          </form>
        )}
      </main>
      <SiteFooter theme={theme} />
    </div>
  )
}
