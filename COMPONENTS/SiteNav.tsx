'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { THEMES, type ThemeKey } from './theme'
import { useSiteTheme } from './useSiteTheme'

// Pass `theme` on brand pages; leave it out to follow the visitor's site theme.
export default function SiteNav({ theme, active }: { theme?: ThemeKey; active?: 'about' }) {
  const siteTheme = useSiteTheme()
  const t = THEMES[theme ?? siteTheme]
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/properties', label: 'Homes Under $300K' },
    { href: `${t.home}#credit-game`, label: 'The Credit Game' },
    { href: `${t.home}#path`, label: 'The Path' },
    { href: t.about, label: 'About', key: 'about' },
    { href: `${t.home}#agents`, label: 'List a Home (Agents)' },
    { href: '/auth/login', label: 'Login' },
  ]
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={t.home} className="flex items-center space-x-2">
            <Image src={t.logo} alt={t.name} width={40} height={40} className="h-10 w-auto" />
            <span className={t.brandText}>{t.name}</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-5">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={active && l.key === active ? 'text-gray-900 font-bold text-sm' : 'text-gray-700 hover:text-gray-900 font-medium text-sm'}
              >
                {l.label}
              </Link>
            ))}
            <Link href={t.switchHref} className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-50 transition">
              {t.switchLabel}
            </Link>
            <Link href="/auth/signup" className={`${t.gradient} text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition`}>
              Play Free
            </Link>
          </div>
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col space-y-3">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href={t.switchHref} className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-2 rounded-full hover:bg-pink-50 transition text-center" onClick={() => setOpen(false)}>
            {t.switchLabel}
          </Link>
          <Link href="/auth/signup" className={`${t.gradient} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition text-center`} onClick={() => setOpen(false)}>
            Play Free
          </Link>
        </div>
      )}
    </nav>
  )
}
