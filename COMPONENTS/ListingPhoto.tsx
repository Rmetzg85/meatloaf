'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { THEMES } from './theme'
import { useSiteTheme } from './useSiteTheme'
import { photoUrl } from '@/lib/listing'

/** Themed "no photo" block, also used when a photo fails to load. */
export function PhotoPlaceholder({ className = '', label = 'Photos coming soon', large = false }: { className?: string; label?: string; large?: boolean }) {
  const t = THEMES[useSiteTheme()]
  return (
    <div className={`${t.gradient} flex flex-col items-center justify-center text-white ${className}`}>
      <Home className={large ? 'w-16 h-16 md:w-20 md:h-20 opacity-60' : 'w-14 h-14 opacity-60'} aria-hidden="true" />
      {label && <p className="mt-2 text-sm font-medium opacity-90">{label}</p>}
    </div>
  )
}

/** A listing photo from Storage with the themed placeholder as fallback (no path, or the image fails). */
export function ListingPhoto({ path, alt, className = '', large = false, eager = false, label }: { path?: string | null; alt: string; className?: string; large?: boolean; eager?: boolean; label?: string }) {
  const [failed, setFailed] = useState(false)
  if (!path || failed) return <PhotoPlaceholder className={className} large={large} label={label} />
  return (
    // Supabase public URLs are already sized on upload; a plain <img> avoids image-optimizer config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photoUrl(path)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}

/** Detail-page gallery: main photo with prev/next and thumbnails. */
export function ListingGallery({ photos, address }: { photos: string[]; address: string }) {
  const [i, setI] = useState(0)
  const n = photos.length
  const go = (d: number) => setI((cur) => (cur + d + n) % n)
  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] sm:aspect-[3/2] rounded-2xl shadow-lg overflow-hidden bg-gray-200">
        <ListingPhoto key={photos[i] ?? 'none'} path={photos[i]} alt={n ? `Photo ${i + 1} of ${n}: ${address}` : ''} className="w-full h-full" large eager />
        <span className="absolute top-3 left-3 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">For sale</span>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-900 shadow hover:bg-white">
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-900 shadow hover:bg-white">
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full" aria-live="polite">
              {i + 1} / {n}
            </span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((p, idx) => (
            <button
              key={p}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show photo ${idx + 1}`}
              aria-current={idx === i}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden ring-2 ${idx === i ? 'ring-gray-900' : 'ring-transparent opacity-80 hover:opacity-100'}`}
            >
              <ListingPhoto path={p} alt="" className="w-full h-full" label="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
