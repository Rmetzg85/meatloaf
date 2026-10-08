// Rule-based matching, Phase 1. No LLM, no inferred preferences.
// Hard filters: price, beds, baths, area the buyer would move to, and (hybrid
// workers) straight-line distance to the office as a commute stand-in.
// Score and reasons use only criteria the buyer chose.

import {
  type BuyerPreferences,
  type Candidate,
  type MatchResult,
  type MatchRun,
  defaultCommuteMinutes,
  MILES_PER_COMMUTE_MINUTE,
  STAY_LOCAL_MILES,
  US_STATES,
} from './types'

type PointFn = (zip: string | null | undefined) => [number, number] | null
type DistFn = (a: [number, number], b: [number, number]) => number

// Words that must never appear in a match reason (Fair Housing guardrail).
const BANNED = [
  'safe', 'unsafe', 'crime', 'family', 'families', 'good school', 'bad school', 'good neighborhood',
  'bad neighborhood', 'exclusive', 'desirable', 'integrated', 'diverse', 'ethnic', 'religio', 'church',
  'mosque', 'synagogue', 'temple', 'disab', 'handicap', 'senior', 'elderly', 'young', 'adult',
  'bachelor', 'couple', 'single', 'children', 'kids', 'race', 'racial', 'color', 'national origin',
  'immigrant', 'gender', 'women', 'men ', 'gay', 'straight', 'quiet', 'up-and-coming', 'gentrif',
]

// Place names the buyer picked (e.g. "Temple, TX") are removed before checking.
export function reasonIsAllowed(reason: string, placeNames: string[] = []): boolean {
  let r = ` ${reason.toLowerCase()} `
  for (const n of placeNames) if (n) r = r.split(n.toLowerCase()).join(' ')
  return !BANNED.some((w) => r.includes(w))
}

const norm = (s: string | null | undefined) => (s ?? '').trim().toLowerCase()
const money = (n: number) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`)
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`
const aboutMiles = (d: number) => `About ${plural(Math.max(1, Math.round(d)), 'mile')}`
const stateName = (code: string) => US_STATES[code.toUpperCase()] ?? code.toUpperCase()

function sameCity(c: Candidate, city: string | null, state: string | null) {
  return !!city && !!state && norm(c.city) === norm(city) && norm(c.state) === norm(state)
}

function placeKey(city: string, state: string) {
  return `${norm(city)}|${norm(state)}`
}

export function runMatching(prefs: BuyerPreferences, candidates: Candidate[], zipPoint: PointFn, milesBetween: DistFn): MatchRun {
  const notes: string[] = []
  const home = zipPoint(prefs.current_zip)
  const scope = prefs.move_scope ?? 'stay_local'

  if ((scope === 'stay_local' || scope === 'within_miles') && !home) {
    notes.push('Add your current ZIP to match by miles. For now we only match homes in your current city.')
  }

  // Hybrid commute proxy.
  let officePoint: [number, number] | null = null
  let commuteMinutes: number | null = null
  let commuteMiles: number | null = null
  const hybrid = prefs.remote_work === 'hybrid'
  if (hybrid) {
    commuteMinutes = prefs.max_commute_minutes ?? defaultCommuteMinutes(prefs.office_days_per_week)
    commuteMiles = commuteMinutes * MILES_PER_COMMUTE_MINUTE
    officePoint = zipPoint(prefs.office_zip)
    if (!officePoint && !(prefs.office_city && prefs.office_state)) {
      notes.push('Add your office city or ZIP to factor in your commute.')
    } else if (!officePoint) {
      notes.push('Add your office ZIP to match by commute distance. For now we only match homes in your office city.')
    }
  }

  const moveStates = new Set((prefs.move_states ?? []).map((s) => s.toUpperCase()))
  const moveCities = new Set(
    (prefs.move_cities ?? []).map((p) => {
      const [city, state] = p.split(',').map((x) => x.trim())
      return placeKey(city ?? '', state ?? '')
    }),
  )

  const results: MatchResult[] = []

  for (const c of candidates) {
    // Price, beds, baths.
    if (!(c.list_price > 0) || c.list_price > prefs.budget_max) continue
    if (prefs.min_beds != null && (c.bedrooms == null || c.bedrooms < prefs.min_beds)) continue
    if (prefs.min_baths != null && (c.bathrooms == null || Number(c.bathrooms) < Number(prefs.min_baths))) continue

    const reasons: string[] = []
    let score = 50
    const p = zipPoint(c.zip_code)
    let distanceMiles: number | null = null

    // Budget.
    const headroom = (prefs.budget_max - c.list_price) / prefs.budget_max
    score += 20 * Math.min(1, headroom / 0.2)
    reasons.push(
      prefs.budget_max - c.list_price >= 5000
        ? `${money(prefs.budget_max - c.list_price)} under your ${money(prefs.budget_max)} budget`
        : `Within your ${money(prefs.budget_max)} budget`,
    )

    // Beds and baths.
    if (prefs.min_beds != null && c.bedrooms != null) {
      score += Math.min(10, 5 * (c.bedrooms - prefs.min_beds))
      reasons.push(`${plural(c.bedrooms, 'bed')} (you asked for ${prefs.min_beds}+)`)
    }
    if (prefs.min_baths != null && c.bathrooms != null) {
      score += Math.min(5, 5 * (Number(c.bathrooms) - Number(prefs.min_baths)))
      reasons.push(`${Number(c.bathrooms)} baths (you asked for ${Number(prefs.min_baths)}+)`)
    }

    // Area the buyer would move to.
    if (scope === 'anywhere') {
      reasons.push(prefs.remote_work === 'full_remote' ? 'You work fully remote and said you’d move anywhere' : 'You said you’d move anywhere')
    } else if (scope === 'specific_places') {
      const inCity = moveCities.has(placeKey(c.city, c.state))
      const inState = moveStates.has(c.state.toUpperCase())
      if (!inCity && !inState) continue
      if (inCity) {
        score += 15
        reasons.push(`In ${c.city}, ${c.state.toUpperCase()}, a city you’d move to`)
      } else {
        score += 10
        reasons.push(`In ${stateName(c.state)}, a state you’d move to`)
      }
    } else {
      const radius = scope === 'within_miles' ? prefs.move_radius_miles ?? STAY_LOCAL_MILES : STAY_LOCAL_MILES
      if (home && p) {
        distanceMiles = milesBetween(home, p)
        if (distanceMiles > radius) continue
        score += 15 * (1 - distanceMiles / radius)
        reasons.push(
          scope === 'within_miles'
            ? `${aboutMiles(distanceMiles)} from your ZIP (you said within ${radius})`
            : `${aboutMiles(distanceMiles)} from your ZIP, close to where you live now`,
        )
      } else {
        if (!sameCity(c, prefs.current_city, prefs.current_state)) continue
        score += 10
        reasons.push(`In ${c.city}, where you live now`)
      }
    }

    // Hybrid commute (straight-line stand-in).
    if (hybrid && commuteMiles != null) {
      if (officePoint && p) {
        const officeMiles = milesBetween(officePoint, p)
        if (officeMiles > commuteMiles) continue
        score += 10 * (1 - officeMiles / commuteMiles)
        reasons.push(
          `${aboutMiles(officeMiles)} from your office ZIP, inside your ${commuteMinutes}-minute commute setting`,
        )
      } else if (prefs.office_city && prefs.office_state) {
        if (!sameCity(c, prefs.office_city, prefs.office_state)) continue
        reasons.push(`In ${c.city}, your office city`)
      }
    } else if (prefs.remote_work === 'full_remote' && scope !== 'anywhere') {
      reasons.push('You work fully remote, so no commute limit')
    }

    const clean = reasons.filter((r) => reasonIsAllowed(r, [c.city, stateName(c.state)]))
    results.push({ property: c, score: Math.round(Math.min(100, score) * 100) / 100, reasons: clean, distanceMiles })
  }

  results.sort((a, b) => b.score - a.score || a.property.list_price - b.property.list_price)
  return { matches: results.slice(0, 50), considered: candidates.length, notes }
}
