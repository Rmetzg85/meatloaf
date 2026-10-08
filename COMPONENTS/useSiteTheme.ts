'use client'

// Shared site theme (Meatloaf or Mimosa) for pages that both brands use.
// The theme is remembered in the `ml_theme` cookie. A provider higher up can
// supply it through SiteThemeContext; without one, the cookie is read directly.

import { createContext, useContext, useSyncExternalStore } from 'react'
import type { ThemeKey } from './theme'

export const THEME_COOKIE = 'ml_theme'

export type SiteThemeState = { theme: ThemeKey; setTheme: (t: ThemeKey) => void }

export const SiteThemeContext = createContext<SiteThemeState | null>(null)

export function parseTheme(value: string | null | undefined): ThemeKey {
  return value === 'mimosa' ? 'mimosa' : 'meatloaf'
}

export function readThemeCookie(): ThemeKey {
  if (typeof document === 'undefined') return 'meatloaf'
  const m = document.cookie.match(/(?:^|;\s*)ml_theme=([^;]+)/)
  return parseTheme(m?.[1])
}

export function writeThemeCookie(theme: ThemeKey) {
  if (typeof document === 'undefined') return
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
}

const noopSubscribe = () => () => {}
const serverTheme = (): ThemeKey => 'meatloaf'

export function useSiteTheme(): ThemeKey {
  const ctx = useContext(SiteThemeContext)
  const fromCookie = useSyncExternalStore(noopSubscribe, readThemeCookie, serverTheme)
  return ctx ? ctx.theme : fromCookie
}
