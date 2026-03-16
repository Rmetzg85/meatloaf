import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Outspend — Political Ads Without the PAC Price Tag',
  description: 'Clip, brand, and share powerful campaign ads in minutes. Built for Republican campaigns. 2026 ready.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
