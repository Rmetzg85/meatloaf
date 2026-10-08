import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Signed-in areas, auth plumbing and APIs.
      disallow: [
        '/api/',
        '/dashboard',
        '/mimosa/dashboard',
        '/landlord/',
        '/agent/',
        '/preferences',
        '/matches',
        '/buyers-agent',
        '/auth/callback',
        '/auth/confirm',
        '/auth/reset-password',
        '/auth/forgot-password',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
