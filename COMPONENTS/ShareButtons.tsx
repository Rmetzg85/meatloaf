'use client'

import { useState } from 'react'
import { Facebook, Instagram, Link as LinkIcon, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { THEMES, type ThemeKey } from './theme'
import { brandHomeUrl } from '@/lib/seo'

// "Share Meatloaf/Mimosa" row for the footers. Always shares the brand homepage.
export default function ShareButtons({ theme, className = '' }: { theme: ThemeKey; className?: string }) {
  const t = THEMES[theme]
  const url = brandHomeUrl(theme)
  const [copied, setCopied] = useState(false)

  const copyLink = async (hint?: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
      toast.success(hint ? `Link copied! ${hint}` : 'Link copied!')
    } catch {
      toast.error(`Couldn't copy. The link is ${url}`)
    }
  }

  // Instagram has no web share URL: use the phone's share sheet (which lists
  // Instagram), and fall back to copying the link on desktop.
  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: `${t.name} - Stop Renting Forever`, text: 'Starter homes under $300K + a free credit game.', url })
        return
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return // user closed the sheet
      }
    }
    copyLink('Paste it into an Instagram story, post or DM.')
  }

  const btn = `inline-flex h-10 w-10 items-center justify-center rounded-full ${t.gradient} text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900`

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${className}`}>
      <p className="text-sm text-gray-300">
        Know someone stuck at home? <span className="font-semibold text-white">Share {t.name}</span>
      </p>
      <div className="flex items-center gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share ${t.name} on Facebook (opens in a new tab)`}
          title="Share on Facebook"
          className={btn}
        >
          <Facebook className="h-5 w-5" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={shareNative}
          aria-label={`Share ${t.name} on Instagram or another app`}
          title="Share (Instagram, messages and more)"
          className={btn}
        >
          <Instagram className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => copyLink()}
          aria-label={copied ? 'Link copied' : `Copy link to ${t.name}`}
          title={copied ? 'Link copied!' : 'Copy link'}
          className={btn}
        >
          {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <LinkIcon className="h-5 w-5" aria-hidden="true" />}
        </button>
        <span className="sr-only" aria-live="polite">{copied ? 'Link copied!' : ''}</span>
      </div>
    </div>
  )
}
