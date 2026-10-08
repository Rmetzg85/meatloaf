// Shared listing rules: only active, non-test homes with a known sale price at or under $300K are public.

export const PRICE_CAP = 300_000

export const isListablePrice = (price: unknown): price is number =>
  typeof price === 'number' && Number.isFinite(price) && price > 0 && price <= PRICE_CAP

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isUuid = (s: string) => UUID_RE.test(s)

export const formatPrice = (n: number) => `$${n.toLocaleString('en-US')}`

export function formatBaths(b: number | string | null | undefined) {
  if (b == null) return null
  const n = Number(b)
  return Number.isFinite(n) ? String(n % 1 === 0 ? n : n.toFixed(1)) : null
}

// Listing photos live in the public `listing-photos` Storage bucket at <owner uid>/<property id>/<file>.
export const PHOTO_BUCKET = 'listing-photos'
export const MAX_PHOTOS = 12
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // matches the bucket's file_size_limit
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export interface PhotoRow {
  id?: string
  storage_path: string
  position: number
}

export function photoUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '')
  return `${base}/storage/v1/object/public/${PHOTO_BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`
}

export const sortPhotos = <T extends PhotoRow>(rows: T[] | null | undefined): T[] =>
  [...(rows ?? [])].sort((a, b) => a.position - b.position)

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'manufactured', label: 'Manufactured home' },
  { value: 'multi-family', label: 'Multi-family' },
] as const
