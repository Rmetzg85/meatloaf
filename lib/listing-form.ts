// Validation for the agent sale-listing form. Pure functions so the rules are easy to read and test.
import { PRICE_CAP, PROPERTY_TYPES } from './listing'

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const

export const LISTING_STATUSES = [
  { value: 'active', label: `Active: shown on the site` },
  { value: 'pending', label: 'Pending sale (hidden)' },
  { value: 'sold', label: 'Sold (hidden)' },
  { value: 'inactive', label: 'Draft (hidden)' },
] as const
export type ListingStatus = (typeof LISTING_STATUSES)[number]['value']

export interface ListingFormValues {
  address: string
  city: string
  state: string
  zip: string
  price: string
  beds: string
  baths: string
  sqft: string
  type: string
  description: string
  status: ListingStatus
}

export const EMPTY_LISTING: ListingFormValues = {
  address: '', city: '', state: '', zip: '', price: '', beds: '', baths: '', sqft: '', type: 'house', description: '', status: 'active',
}

export const DESCRIPTION_MAX = 4000

// Fair housing: describe the home, not who should live there or what the neighbors are like.
const FAIR_HOUSING_FLAGS = [
  'family-friendly', 'family friendly', 'perfect for families', 'ideal for families', 'great for families', 'no children', 'no kids',
  'adults only', 'adult community', 'singles', 'bachelor', 'empty nesters', 'retirees', 'couples only',
  'safe neighborhood', 'safe area', 'safe street', 'low crime', 'crime-free', 'good neighborhood', 'nice neighborhood',
  'good schools', 'great schools', 'best schools', 'exclusive', 'diverse neighborhood', 'ethnic',
  'christian', 'church nearby', 'near church', 'synagogue', 'mosque', 'able-bodied', 'no wheelchairs', 'english only', 'no section 8',
]

export function fairHousingFlags(text: string): string[] {
  const t = text.toLowerCase()
  return FAIR_HOUSING_FLAGS.filter((w) => new RegExp(`(^|[^a-z])${w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}([^a-z]|$)`).test(t))
}

/** "$249,900" -> 249900; anything that isn't a whole dollar amount -> NaN. */
export function parsePrice(raw: string): number {
  const s = raw.replace(/[$,\s]/g, '')
  return /^\d+$/.test(s) ? Number(s) : NaN
}

export const priceCapMessage = `Price must be $${PRICE_CAP.toLocaleString('en-US')} or less. Meatloaf only lists starter homes at or under $300K.`

export type ListingErrors = Partial<Record<keyof ListingFormValues, string>>

export function validateListing(v: ListingFormValues): ListingErrors {
  const e: ListingErrors = {}
  if (v.address.trim().length < 3) e.address = 'Enter the street address.'
  else if (v.address.trim().length > 200) e.address = 'Keep the address under 200 characters.'
  if (!v.city.trim()) e.city = 'Enter the city.'
  else if (v.city.trim().length > 100) e.city = 'Keep the city under 100 characters.'
  if (!(US_STATES as readonly string[]).includes(v.state)) e.state = 'Choose a state.'
  if (!/^\d{5}$/.test(v.zip.trim())) e.zip = 'Enter a 5-digit ZIP code.'

  const price = parsePrice(v.price)
  if (!v.price.trim()) e.price = 'Enter the list price.'
  else if (Number.isNaN(price)) e.price = 'Enter a whole-dollar price, like 249900.'
  else if (price <= 0) e.price = 'Price must be more than $0.'
  else if (price > PRICE_CAP) e.price = priceCapMessage

  const beds = Number(v.beds)
  if (v.beds.trim() === '' || !Number.isInteger(beds) || beds < 0 || beds > 20) e.beds = 'Enter bedrooms (0 to 20).'
  const baths = Number(v.baths)
  if (v.baths.trim() === '' || Number.isNaN(baths) || baths < 0 || baths > 20 || Math.round(baths * 4) !== baths * 4)
    e.baths = 'Enter bathrooms (0 to 20, e.g. 1.5).'
  if (v.sqft.trim() !== '') {
    const sq = Number(v.sqft.replace(/,/g, ''))
    if (!Number.isInteger(sq) || sq < 100 || sq > 20000) e.sqft = 'Enter square feet between 100 and 20,000, or leave it blank.'
  }
  if (!PROPERTY_TYPES.some((p) => p.value === v.type)) e.type = 'Choose a home type.'

  if (v.description.length > DESCRIPTION_MAX) e.description = `Keep the description under ${DESCRIPTION_MAX.toLocaleString('en-US')} characters.`
  else {
    const flags = fairHousingFlags(v.description)
    if (flags.length)
      e.description = `Describe the home, not who should live there or the neighborhood's people. Please remove: ${flags.map((f) => `"${f}"`).join(', ')}.`
  }
  return e
}

/** Row values for public.properties (sale listing: no rent fields). */
export function toPropertyRow(v: ListingFormValues) {
  return {
    address: v.address.trim(),
    city: v.city.trim(),
    state: v.state,
    zip_code: v.zip.trim(),
    bedrooms: Number(v.beds),
    bathrooms: Number(v.baths),
    square_feet: v.sqft.trim() ? Number(v.sqft.replace(/,/g, '')) : null,
    property_type: v.type,
    description: v.description.trim() || null,
  }
}
