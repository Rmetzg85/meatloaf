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
