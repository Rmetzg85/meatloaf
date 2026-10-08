'use client'

// Holds the current site theme for the whole app. Starts from the ml_theme
// cookie (read on the server in the root layout) and updates the cookie and
// <html data-theme> when a brand page (/, /mimosa, the about pages) is visited.

import { useCallback, useMemo, useState } from 'react'
import type { ThemeKey } from './theme'
import { SiteThemeContext, writeThemeCookie } from './useSiteTheme'

export default function SiteThemeProvider({ initialTheme, children }: { initialTheme: ThemeKey; children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(initialTheme)
  const setTheme = useCallback((next: ThemeKey) => {
    writeThemeCookie(next)
    document.documentElement.dataset.theme = next
    setThemeState(next)
  }, [])
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>
}
