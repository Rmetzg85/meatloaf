// app/properties/[id]/page.tsx: public home detail page.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteNav from '@/COMPONENTS/SiteNav'
import SiteFooter from '@/COMPONENTS/SiteFooter'
import PropertyDetail from '@/COMPONENTS/PropertyDetail'
import { getListing } from '@/lib/listing-server'
import { formatPrice } from '@/lib/listing'
import { cookieTheme, SITE_URL } from '@/lib/seo'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const home = await getListing(id)
  const theme = await cookieTheme()
  const brand = theme === 'mimosa' ? 'Mimosa' : 'Meatloaf'
  // Unknown, inactive, test or over-cap homes render the branded 404 (which Next marks noindex).
  if (!home) return { title: `Page not found | ${brand}`, robots: { index: false, follow: true } }

  const beds = home.bedrooms != null ? `${home.bedrooms} bd ` : ''
  const title = `${formatPrice(home.list_price)} · ${beds}${home.address}, ${home.city}, ${home.state} | ${brand}`
  const specs = [
    home.bedrooms != null ? `${home.bedrooms} bed` : null,
    home.bathrooms != null ? `${home.bathrooms} bath` : null,
    home.square_feet ? `${home.square_feet.toLocaleString('en-US')} sq ft` : null,
  ].filter(Boolean).join(', ')
  const description = `${specs ? `${specs} ` : ''}${home.property_type ?? 'home'} for sale at ${formatPrice(home.list_price)} in ${home.city}, ${home.state}. A starter home under $300K on ${brand}. Confirm details with the listing agent.`
  const path = `/properties/${home.id}`
  const image = { url: theme === 'mimosa' ? '/og-mimosa.jpg' : '/og-meatloaf.jpg', width: 1200, height: 630, alt: `${brand}: starter homes under $300K` }
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: brand, title, description, url: `${SITE_URL}${path}`, images: [image], locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
    robots: { index: true, follow: true },
  }
}

export default async function PropertyDetailPage({ params }: Params) {
  const { id } = await params
  const home = await getListing(id)
  if (!home) notFound()
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <PropertyDetail home={home} shareUrl={`${SITE_URL}/properties/${home.id}`} />
      <SiteFooter />
    </div>
  )
}
