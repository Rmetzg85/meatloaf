import type { Metadata } from 'next'
import SiteNav from '@/COMPONENTS/SiteNav'
import SiteFooter from '@/COMPONENTS/SiteFooter'
import { NotFoundBody } from '@/COMPONENTS/NotFoundBody'
import { cookieTheme } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const brand = (await cookieTheme()) === 'mimosa' ? 'Mimosa' : 'Meatloaf'
  return { title: `Page not found | ${brand}` } // Next adds noindex itself
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <NotFoundBody />
      <SiteFooter />
    </div>
  )
}
