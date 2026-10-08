// AI matching, Phase 1 (rules only, no LLM).
// Only fields the buyer chose to give us. No protected-class fields.

export type MoveScope = 'stay_local' | 'within_miles' | 'specific_places' | 'anywhere'
export type RemoteWork = 'full_remote' | 'hybrid' | 'not_remote'
export type Timeline = 'under_3_months' | '3_6_months' | '6_12_months' | 'just_looking'

export type BuyerPreferences = {
  user_id: string
  budget_max: number
  min_beds: number | null
  min_baths: number | null
  current_city: string | null
  current_state: string
  current_zip: string | null
  move_scope: MoveScope | null
  move_radius_miles: number | null
  move_states: string[] | null
  move_cities: string[] | null
  remote_work: RemoteWork | null
  office_days_per_week: number | null
  office_city: string | null
  office_state: string | null
  office_zip: string | null
  max_commute_minutes: number | null
  needs_transit: boolean | null
  wants_walkable: boolean | null
  school_ratings_matter: boolean | null
  timeline: Timeline | null
  match_opt_in: boolean
  opt_in_at: string | null
}

export type Candidate = {
  id: string
  address: string
  city: string
  state: string
  zip_code: string | null
  bedrooms: number | null
  bathrooms: number | null
  property_type: string | null
  list_price: number
  is_test: boolean
}

export type MatchResult = {
  property: Candidate
  score: number
  reasons: string[]
  distanceMiles: number | null
}

export type MatchRun = {
  matches: MatchResult[]
  considered: number
  notes: string[]
}

// Plan defaults for hybrid workers (one-way minutes). Buyer can override.
export function defaultCommuteMinutes(daysPerWeek: number | null): number {
  if (!daysPerWeek || daysPerWeek <= 1) return 90
  if (daysPerWeek <= 3) return 60
  return 45
}

// Straight-line distance stands in for commute time until we add a routing source.
// Assumes ~30 mph average door to door, so 1 minute ~ 0.5 miles.
export const MILES_PER_COMMUTE_MINUTE = 0.5
export const STAY_LOCAL_MILES = 25
export const RULES_VERSION = 'phase1-v1'

export const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}
