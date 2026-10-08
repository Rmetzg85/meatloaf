'use client'

import Link from 'next/link'
import { THEMES } from './theme'
import { useSiteTheme } from './useSiteTheme'

// Themed body for app/not-found.tsx (follows the visitor's brand).
export function NotFoundBody() {
  const t = THEMES[useSiteTheme()]
  return (
    <main className={`flex-1 ${t.sectionBg} flex items-center justify-center px-4 py-24`}>
      <div className="max-w-xl text-center">
        <p className={`text-sm font-semibold uppercase tracking-wider ${t.labelText} mb-3`}>404</p>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">This page moved out.</h1>
        <p className="text-lg text-gray-700 mb-8">
          We couldn&apos;t find that page. It may have been renamed, or the link has a typo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={t.home} className={`${t.gradient} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition`}>
            Back to {t.name}
          </Link>
          <Link href="/properties" className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Browse Homes Under $300K
          </Link>
        </div>
      </div>
    </main>
  )
}
