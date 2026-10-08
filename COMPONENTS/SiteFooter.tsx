'use client'

import Link from 'next/link'
import Image from 'next/image'
import { THEMES, CONTACT_EMAIL, FOOTER_DISCLAIMER, type ThemeKey } from './theme'
import { useSiteTheme } from './useSiteTheme'

// Pass `theme` on brand pages; leave it out to follow the visitor's site theme.
export default function SiteFooter({ theme }: { theme?: ThemeKey }) {
  const siteTheme = useSiteTheme()
  const t = THEMES[theme ?? siteTheme]
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image src={t.logo} alt={t.name} width={32} height={32} className="h-8 w-auto" />
              <span className="text-xl font-bold">{t.name}</span>
            </div>
            <p className="text-gray-400 text-sm">Own the deed, not the debt.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/properties" className="hover:text-white transition">Homes</Link></li>
              <li><Link href={`${t.home}#credit-game`} className="hover:text-white transition">Credit Game</Link></li>
              <li><Link href={`${t.home}#path`} className="hover:text-white transition">The Path</Link></li>
              <li><Link href={t.about} className="hover:text-white transition">About</Link></li>
              <li><Link href={`${t.home}#agents`} className="hover:text-white transition">List a Home</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm mb-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition">{CONTACT_EMAIL}</a>
            </p>
            <p className="text-gray-400 text-sm">Baltimore, MD</p>
          </div>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed border-t border-gray-800 pt-6 mb-6">{FOOTER_DISCLAIMER}</p>

        <div className="text-center text-gray-400 text-sm">
          © 2026 REMVentures LLC. All rights reserved.
          <span className="mx-2" aria-hidden>·</span>
          <Link href={t.switchHref} className="hover:text-white transition">{t.switchLabel}</Link>
        </div>
      </div>
    </footer>
  )
}
