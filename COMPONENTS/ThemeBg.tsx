'use client'

// Wraps server-rendered inner pages in the visitor's theme wash (sectionBg).

import { THEMES } from './theme'
import { useSiteTheme } from './useSiteTheme'

export default function ThemeBg({
  variant = 'section',
  className = '',
  children,
}: {
  variant?: 'section' | 'alt'
  className?: string
  children: React.ReactNode
}) {
  const t = THEMES[useSiteTheme()]
  return <div className={`${variant === 'alt' ? t.altSectionBg : t.sectionBg} ${className}`}>{children}</div>
}
