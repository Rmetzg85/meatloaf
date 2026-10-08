import type { Metadata } from 'next'
import type { ThemeKey } from '@/COMPONENTS/theme'

// Canonical origin (the apex 308-redirects here).
export const SITE_URL = 'https://www.meatloaf.rent'

export const SITE_DESCRIPTION =
  'Starter homes under $300K and a free credit game with a practice score. No credit pulls, no bureau reporting.'

const BRAND: Record<ThemeKey, { name: string; path: string; image: string; alt: string }> = {
  meatloaf: {
    name: 'Meatloaf',
    path: '/',
    image: '/og-meatloaf.jpg',
    alt: "Meatloaf: You're 30. Mom's Making Meatloaf. Again. Starter homes under $300K + a free credit game.",
  },
  mimosa: {
    name: 'Mimosa',
    path: '/mimosa',
    image: '/og-mimosa.jpg',
    alt: "Mimosa: Hungover. Childhood Home. Dad's Texting Again. Starter homes under $300K + a free credit game.",
  },
}

/** The brand homepage visitors share from the footer. */
export function brandHomeUrl(theme: ThemeKey) {
  return SITE_URL + (BRAND[theme].path === '/' ? '/' : BRAND[theme].path)
}

/** Title + Open Graph + Twitter card for a brand. Pass `path` for the page's own URL. */
export function brandMetadata(theme: ThemeKey, path?: string): Metadata {
  const b = BRAND[theme]
  const title = `${b.name} - Stop Renting Forever`
  const image = { url: b.image, width: 1200, height: 630, alt: b.alt }
  return {
    title,
    description: SITE_DESCRIPTION,
    openGraph: {
      type: 'website',
      siteName: b.name,
      title,
      description: SITE_DESCRIPTION,
      ...(path ? { url: path } : {}),
      images: [image],
      locale: 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description: SITE_DESCRIPTION, images: [image.url] },
    ...(path ? { alternates: { canonical: path } } : {}),
  }
}
