// ZIP centroid lookup for distance-based matching (server only).
// Source: U.S. Census Bureau 2024 Gazetteer, ZCTA internal points (public domain).
import centroids from './zcta-centroids.json'

const ZIPS = centroids as unknown as Record<string, [number, number]>

export function zipPoint(zip: string | null | undefined): [number, number] | null {
  if (!zip) return null
  const z = zip.trim().slice(0, 5)
  return ZIPS[z] ?? null
}

export function milesBetween(a: [number, number], b: [number, number]): number {
  const R = 3958.8
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
