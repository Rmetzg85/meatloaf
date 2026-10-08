'use client'

// Dropped into brand pages (/ and /mimosa, plus the about pages) so the rest
// of the visit stays on that brand. Visiting / switches back to Meatloaf.

import { useContext, useEffect } from 'react'
import type { ThemeKey } from './theme'
import { SiteThemeContext, writeThemeCookie } from './useSiteTheme'

export default function ThemeSetter({ theme }: { theme: ThemeKey }) {
  const ctx = useContext(SiteThemeContext)
  useEffect(() => {
    if (ctx) {
      if (ctx.theme !== theme) ctx.setTheme(theme)
    } else {
      writeThemeCookie(theme)
    }
  }, [ctx, theme])
  return null
}
