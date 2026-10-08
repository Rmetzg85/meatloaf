'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Bath, BedDouble, Home, Mail, MapPin, Ruler, Tag, UserRound } from 'lucide-react'
import { THEMES, CONTACT_EMAIL } from './theme'
import { useSiteTheme } from './useSiteTheme'
import ShareButtons from './ShareButtons'
import { ListingGallery } from './ListingPhoto'
import { supabase } from '@/lib/supabase'
import { formatBaths, formatPrice } from '@/lib/listing'
import type { ListingDetail } from '@/lib/listing-server'

type Viewer = { status: 'unknown' } | { status: 'out' } | { status: 'in'; userId: string }

function useViewer(): Viewer {
  const [viewer, setViewer] = useState<Viewer>({ status: 'unknown' })
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      setViewer(u ? { status: 'in', userId: u.id } : { status: 'out' })
    })
  }, [])
  return viewer
}

function ContactAgent({ home }: { home: ListingDetail }) {
  const t = THEMES[useSiteTheme()]
  const viewer = useViewer()
  const [agentEmail, setAgentEmail] = useState<string | null | undefined>(undefined)
  const signedIn = viewer.status === 'in'

  // The agent's email is never public: listing_agent_contact only answers signed-in users, for active listings.
  useEffect(() => {
    if (!signedIn) return
    supabase
      .rpc('listing_agent_contact', { p_property_id: home.id })
      .then(({ data, error }) => {
        if (error) console.warn('[listing] agent contact lookup failed', error.code)
        const row = (Array.isArray(data) ? data[0] : data) as { email?: string | null } | null | undefined
        setAgentEmail(row?.email?.trim() || null)
      })
  }, [signedIn, home.id])

  const here = `/properties/${home.id}`
  const subject = `Question about ${home.address}, ${home.city}, ${home.state} (via ${t.name})`
  const body = `Hi${home.agent_name ? ` ${home.agent_name.split(' ')[0]}` : ''},\n\nI saw ${home.address} (${formatPrice(home.list_price)}) on ${t.name} and would like to learn more.\n\n${typeof window !== 'undefined' ? window.location.origin : 'https://www.meatloaf.rent'}${here}\n`
  const mailto = (to: string) => `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <div id="contact-agent" className="rounded-2xl bg-white shadow-lg p-6 scroll-mt-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Contact the agent</h2>
      {home.agent_name && (
        <p className="flex items-center gap-2 text-gray-700 mb-4">
          <UserRound className="w-4 h-4 text-gray-500" aria-hidden="true" />
          Listed by <span className="font-semibold">{home.agent_name}</span>
        </p>
      )}

      {viewer.status === 'unknown' && <div className="h-24 rounded-lg bg-gray-100 animate-pulse" aria-hidden="true" />}

      {viewer.status === 'out' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Create a free Future Homeowner account to contact the listing agent. No credit pull, ever.
          </p>
          <Link href={`/auth/signup?next=${encodeURIComponent(here)}`} className={`block text-center ${t.gradient} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition`}>
            Sign up free to contact the agent
          </Link>
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link href={`/auth/login?next=${encodeURIComponent(here)}`} className={`${t.labelText} font-semibold hover:underline`}>Log in</Link>
          </p>
        </div>
      )}

      {viewer.status === 'in' && viewer.userId === home.landlord_id && (
        <p className="text-sm text-gray-700">
          This is your listing.{' '}
          <Link href={`/agent/listings/${home.id}/edit`} className={`${t.labelText} font-semibold hover:underline`}>Manage it</Link>
        </p>
      )}

      {viewer.status === 'in' && viewer.userId !== home.landlord_id && (
        agentEmail === undefined ? (
          <div className="h-12 rounded-lg bg-gray-100 animate-pulse" aria-hidden="true" />
        ) : (
          <div className="space-y-3">
            <a href={mailto(agentEmail || CONTACT_EMAIL)} className={`flex items-center justify-center gap-2 ${t.gradient} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition`}>
              <Mail className="w-5 h-5" aria-hidden="true" />
              {agentEmail ? 'Email the agent' : `Ask ${t.name} to connect you`}
            </a>
            {agentEmail && <p className="text-xs text-gray-600 text-center break-words">{agentEmail}</p>}
            <p className="text-xs text-gray-600">You choose who to talk to. The agent, not {t.name}, gives professional advice.</p>
          </div>
        )
      )}
    </div>
  )
}

export default function PropertyDetail({ home, shareUrl }: { home: ListingDetail; shareUrl: string }) {
  const theme = useSiteTheme()
  const t = THEMES[theme]
  const baths = formatBaths(home.bathrooms)
  const perSqft = home.square_feet ? Math.round(home.list_price / home.square_feet) : null
  const facts = [
    home.bedrooms != null && { icon: BedDouble, label: 'Bedrooms', value: String(home.bedrooms) },
    baths && { icon: Bath, label: 'Bathrooms', value: baths },
    home.square_feet && { icon: Ruler, label: 'Size', value: `${home.square_feet.toLocaleString('en-US')} sq ft` },
    home.property_type && { icon: Home, label: 'Type', value: home.property_type.charAt(0).toUpperCase() + home.property_type.slice(1) },
    perSqft && { icon: Tag, label: 'Price per sq ft', value: formatPrice(perSqft) },
  ].filter(Boolean) as { icon: typeof Home; label: string; value: string }[]

  return (
    <main className={`flex-1 ${t.sectionBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Link href="/properties" className={`inline-flex items-center gap-1 text-sm font-semibold ${t.labelText} hover:underline mb-4`}>
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> All homes under $300K
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          <div className="space-y-6 min-w-0">
            <ListingGallery photos={home.photos} address={`${home.address}, ${home.city}, ${home.state}`} />

            <div className="rounded-2xl bg-white shadow-lg p-6">
              <p className={`text-3xl md:text-4xl font-black ${t.gradientText}`}>{formatPrice(home.list_price)}</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 break-words">{home.address}</h1>
              <p className="mt-1 flex items-center gap-1 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" aria-hidden="true" />
                {home.city}, {home.state}{home.zip_code ? ` ${home.zip_code}` : ''}
              </p>

              {facts.length > 0 && (
                <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facts.map((f) => (
                    <div key={f.label} className={`rounded-xl ${t.softBg} p-3`}>
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        <f.icon className={`w-4 h-4 ${t.accentText}`} aria-hidden="true" /> {f.label}
                      </dt>
                      <dd className="mt-1 text-lg font-bold text-gray-900">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {/* On phones the contact card sits below the details; jump to it. */}
              <a href="#contact-agent" className={`lg:hidden mt-5 block text-center ${t.gradient} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition`}>
                Contact the agent
              </a>
            </div>

            {home.description && (
              <div className="rounded-2xl bg-white shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">About this home</h2>
                <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed">{home.description}</p>
              </div>
            )}

            <p className="text-xs text-gray-600 leading-relaxed">
              Listing details are provided by the listing agent and may be inaccurate or out of date. Confirm price, availability and all
              details with the agent before making decisions. {t.name} is not a real estate brokerage and does not give financial advice.
              Equal Housing Opportunity.
            </p>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <ContactAgent home={home} />
            <div className="rounded-2xl bg-white shadow-lg p-5">
              <ShareButtons
                theme={theme}
                url={shareUrl}
                variant="light"
                className="!items-start sm:!flex-col !gap-3"
                label={<span className="font-semibold text-gray-900">Share this home</span>}
              />
            </div>
            <div className={`rounded-2xl ${t.softBg} p-5`}>
              <p className="text-sm text-gray-800">
                <span className="font-semibold">Getting ready to buy?</span> Practice with the free credit game. No credit pull, no bureau reporting.
              </p>
              <Link href="/auth/signup" className={`mt-2 inline-block text-sm font-semibold ${t.labelText} hover:underline`}>Play free</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
