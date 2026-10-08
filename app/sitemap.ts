import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Public pages for both modes. Inner pages (homes, contact, legal, auth) are shared and
// follow the visitor's theme, so they're listed once.
const PAGES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/mimosa', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/mimosa/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/properties', priority: 0.9, changeFrequency: 'daily' },
  { path: '/auth/signup', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/auth/login', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PAGES.map((p) => ({
    url: p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))
}
