// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Meatloaf - Stop Renting Forever',
  description: 'Starter homes under $300K and a free credit game with a practice score. No credit pulls, no bureau reporting.',
  metadataBase: new URL('https://Meatloaf.Rent'),
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
