// Story themes. Meatloaf and Mimosa are two relatable takes on the same story:
// same homes, same free game, same rules. Anyone can pick either one.
// Class names are written out in full so Tailwind can detect them.

export type ThemeKey = 'meatloaf' | 'mimosa'

export type Theme = {
  key: ThemeKey
  name: string
  home: string
  about: string
  logo: string
  switchHref: string
  switchLabel: string
  pageBg: string
  // Soft theme washes for light sections. Alternate sectionBg / altSectionBg
  // between stacked light sections; keep cards and inputs white on top.
  sectionBg: string
  altSectionBg: string
  brandText: string
  gradient: string
  gradientText: string
  heroAccent: string
  heroBody: string
  primaryBtnText: string
  secondaryBtn: string
  pathCard: string
  pathTitle: string
  pathBorder: string
  softBg: string
  accentText: string
  // Small accent text (labels) that sits on the section washes; AA-safe.
  labelText: string
  accentBorder: string
  aboutHero: string
  aboutHeroText: string
  ctaSubText: string
}

export const THEMES: Record<ThemeKey, Theme> = {
  meatloaf: {
    key: 'meatloaf',
    name: 'Meatloaf',
    home: '/',
    about: '/about',
    logo: '/logo.png',
    switchHref: '/mimosa',
    switchLabel: 'Switch to Mimosa →',
    pageBg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100',
    sectionBg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100',
    altSectionBg: 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100',
    brandText: 'text-2xl font-bold text-gray-900',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
    gradientText: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
    heroAccent: 'text-yellow-300',
    heroBody: 'text-blue-50',
    primaryBtnText: 'text-blue-600',
    secondaryBtn: 'bg-blue-700 hover:bg-blue-800',
    pathCard: 'bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-400/40',
    pathTitle: 'text-blue-300',
    pathBorder: 'border-blue-700/50',
    softBg: 'bg-gradient-to-br from-blue-50 to-purple-50',
    accentText: 'text-blue-600',
    labelText: 'text-blue-700',
    accentBorder: 'border-blue-600',
    aboutHero: 'bg-gradient-to-r from-blue-900 to-purple-900',
    aboutHeroText: 'text-blue-100',
    ctaSubText: 'text-blue-100',
  },
  mimosa: {
    key: 'mimosa',
    name: 'Mimosa',
    home: '/mimosa',
    about: '/mimosa/about',
    logo: '/mimosa-logo.svg',
    switchHref: '/',
    switchLabel: 'Switch to Meatloaf →',
    pageBg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50',
    sectionBg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50',
    altSectionBg: 'bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100',
    brandText: 'text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-pink-500 to-rose-400',
    gradientText: 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent',
    heroAccent: 'text-amber-200',
    heroBody: 'text-pink-50',
    primaryBtnText: 'text-pink-600',
    secondaryBtn: 'bg-pink-600 hover:bg-pink-700',
    pathCard: 'bg-gradient-to-br from-pink-900 to-rose-900 border border-pink-400/40',
    pathTitle: 'text-pink-300',
    pathBorder: 'border-pink-700/50',
    softBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    accentText: 'text-pink-500',
    labelText: 'text-pink-700',
    accentBorder: 'border-pink-500',
    aboutHero: 'bg-gradient-to-r from-pink-900 to-rose-800',
    aboutHeroText: 'text-pink-100',
    ctaSubText: 'text-pink-100',
  },
}

export { CONTACT_EMAIL } from '@/lib/site'

export const footerDisclaimer = (brand: string) =>
  `${brand} is an educational and home-search platform operated by REMVentures LLC. We are not a credit repair organization, credit bureau, lender, mortgage broker, or real estate brokerage, and we do not report information to any credit reporting agency. The credit game uses simulated scores for education only. Nothing on this site is financial, legal, tax, or real estate advice, and we make no guarantee of credit score changes, loan approval, or home purchase. Listings are provided by public sources and third-party agents and may be inaccurate or unavailable. Not affiliated with HUD, Fannie Mae, Freddie Mac, or USDA. Equal Housing Opportunity.`

// Market stat shown under the homepage hero on both themes.
// Update `homes` and `asOf` together when the estimate is refreshed.
export const MARKET_STAT = {
  homes: 345_000,
  asOf: 'Sept 2026',
  source: 'Realtor.com listing data',
}
