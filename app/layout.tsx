// app/layout.tsx
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import SiteThemeProvider from '@/COMPONENTS/SiteThemeProvider'
import type { ThemeKey } from '@/COMPONENTS/theme'

async function siteTheme(): Promise<ThemeKey> {
  // Cookie name matches THEME_COOKIE in COMPONENTS/useSiteTheme.ts.
  return (await cookies()).get('ml_theme')?.value === 'mimosa' ? 'mimosa' : 'meatloaf'
}

export async function generateMetadata(): Promise<Metadata> {
  const theme = await siteTheme()
  return {
    title: `${theme === 'mimosa' ? 'Mimosa' : 'Meatloaf'} - Stop Renting Forever`,
    description: 'Starter homes under $300K and a free credit game with a practice score. No credit pulls, no bureau reporting.',
    metadataBase: new URL('https://Meatloaf.Rent'),
  }
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Visitors who came in through /mimosa keep the Mimosa brand on every page.
  const theme = await siteTheme()
  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body>
        <SiteThemeProvider initialTheme={theme}>{children}</SiteThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
