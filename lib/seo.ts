import type { Metadata } from 'next'
import type { ThemeKey } from '@/COMPONENTS/theme'

import { SITE_URL } from './site'

// Canonical origin: https://www.meatloafhomes.com (defined in lib/site.ts).
export { SITE_URL }

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
export function brandMetadata(theme: ThemeKey, path?: string, page?: { title: string; description: string }): Metadata {
  const b = BRAND[theme]
  const title = page ? `${page.title} | ${b.name}` : `${b.name} - Stop Renting Forever`
  const description = page?.description ?? SITE_DESCRIPTION
  const image = { url: b.image, width: 1200, height: 630, alt: b.alt }
  return {
    title,
    description: description,
    openGraph: {
      type: 'website',
      siteName: b.name,
      title,
      description: description,
      ...(path ? { url: path } : {}),
      images: [image],
      locale: 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description: description, images: [image.url] },
    ...(path ? { alternates: { canonical: path } } : {}),
  }
}

const BRAND_NAMES: Record<ThemeKey, string> = { meatloaf: 'Meatloaf', mimosa: 'Mimosa' }

/** Server-only: the visitor's brand from the ml_theme cookie (inner pages follow it). */
export async function cookieTheme(): Promise<ThemeKey> {
  const { cookies } = await import('next/headers')
  return (await cookies()).get('ml_theme')?.value === 'mimosa' ? 'mimosa' : 'meatloaf'
}

/**
 * Metadata for inner pages: unique title + description, canonical, og:url and og:site_name.
 * `describe` gets the brand name so the copy matches the theme the visitor is on.
 */
export async function pageMetadata(opts: {
  title: string
  describe: (brand: string) => string
  path: string
  noindex?: boolean
}): Promise<Metadata> {
  const theme = await cookieTheme()
  const brand = BRAND_NAMES[theme]
  const title = `${opts.title} | ${brand}`
  const description = opts.describe(brand)
  const b = BRAND[theme]
  const image = { url: b.image, width: 1200, height: 630, alt: b.alt }
  return {
    title,
    description,
    alternates: { canonical: opts.path },
    openGraph: { type: 'website', siteName: brand, title, description, url: opts.path, images: [image], locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Signed-in / utility pages: their own title, kept out of search results. No canonical needed. */
export async function privatePageMetadata(title: string, theme?: ThemeKey): Promise<Metadata> {
  const brand = BRAND_NAMES[theme ?? (await cookieTheme())]
  return { title: `${title} | ${brand}`, robots: { index: false, follow: false } }
}
