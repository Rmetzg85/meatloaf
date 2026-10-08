'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bath, BedDouble, Eye, Loader2, Pencil, Plus } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import AgentShell from '@/COMPONENTS/agent/AgentShell'
import { ListingPhoto } from '@/COMPONENTS/ListingPhoto'
import { THEMES } from '@/COMPONENTS/theme'
import { useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import { supabase } from '@/lib/supabase'
import { formatBaths, formatPrice, isListablePrice, sortPhotos, type PhotoRow } from '@/lib/listing'

interface Row {
  id: string
  address: string
  city: string
  state: string
  status: string
  bedrooms: number | null
  bathrooms: number | null
  property_sale_info: { list_price: number; is_test: boolean } | null
  property_photos: PhotoRow[] | null
}

const STATUS_LABEL: Record<string, string> = { active: 'Active', inactive: 'Draft', pending: 'Pending', sold: 'Sold', rented: 'Rented' }

function MyListings({ user }: { user: User }) {
  const t = THEMES[useSiteTheme()]
  const [rows, setRows] = useState<Row[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    supabase
      .from('properties')
      .select('id, address, city, state, status, bedrooms, bathrooms, property_sale_info(list_price, is_test), property_photos(storage_path, position)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('[listings] load failed', error.code); setFailed(true) }
        setRows((data ?? []) as unknown as Row[])
      })
  }, [user.id])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black ${t.gradientText}`}>My listings</h1>
          <p className="text-gray-700 mt-1">Homes for sale at or under $300K. Active listings appear on {t.name}&apos;s home search.</p>
        </div>
        <Link href="/agent/listings/new" className={`inline-flex items-center justify-center gap-2 ${t.gradient} text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition`}>
          <Plus className="w-5 h-5" aria-hidden="true" /> New listing
        </Link>
      </div>

      {rows === null ? (
        <div className="flex justify-center py-16" role="status" aria-label="Loading"><Loader2 className={`w-10 h-10 animate-spin ${t.accentText}`} aria-hidden="true" /></div>
      ) : failed ? (
        <p className="rounded-xl bg-white shadow p-6 text-gray-700">We couldn&apos;t load your listings. Refresh to try again.</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h2>
          <p className="text-gray-700 mb-6">Add your first starter home: address, price, details and photos. It takes about five minutes.</p>
          <Link href="/agent/listings/new" className={`inline-block ${t.gradient} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition`}>List a home</Link>
        </div>
      ) : (
        <ul className="grid gap-4">
          {rows.map((r) => {
            const sale = Array.isArray(r.property_sale_info) ? r.property_sale_info[0] : r.property_sale_info
            const isTest = !!sale?.is_test
            const isPublic = r.status === 'active' && !isTest && isListablePrice(sale?.list_price)
            const baths = formatBaths(r.bathrooms == null ? null : Number(r.bathrooms))
            return (
              <li key={r.id} className="rounded-2xl bg-white shadow-lg overflow-hidden flex flex-col sm:flex-row">
                <ListingPhoto path={sortPhotos(r.property_photos)[0]?.storage_path} alt={`${r.address}, ${r.city}, ${r.state}`} className="h-40 sm:h-auto sm:w-56 shrink-0" label="" />
                <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                      {isTest ? 'TEST (hidden)' : isPublic ? 'Live' : STATUS_LABEL[r.status] ?? r.status}
                    </span>
                    <span className="text-xl font-black text-gray-900">{sale?.list_price ? formatPrice(sale.list_price) : 'No price'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 break-words">{r.address}</p>
                    <p className="text-sm text-gray-600">{r.city}, {r.state}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-700">
                    {r.bedrooms != null && <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" aria-hidden="true" />{r.bedrooms} bd</span>}
                    {baths && <span className="flex items-center gap-1"><Bath className="w-4 h-4" aria-hidden="true" />{baths} ba</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link href={`/agent/listings/${r.id}/edit`} className={`inline-flex items-center gap-1.5 rounded-lg border ${t.accentBorder} px-4 py-2 text-sm font-semibold ${t.labelText} hover:opacity-80`}>
                      <Pencil className="w-4 h-4" aria-hidden="true" /> {isTest ? 'View' : 'Edit'}
                    </Link>
                    {isPublic && (
                      <Link href={`/properties/${r.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                        <Eye className="w-4 h-4" aria-hidden="true" /> View public page
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <p className="text-xs text-gray-600 mt-8">
        Founding rate: $29 per home for 90 days. Online checkout isn&apos;t live yet; nothing is charged here. Listings must comply with fair housing law.
      </p>
    </div>
  )
}

export default function AgentListingsPage() {
  return <AgentShell>{(user) => <MyListings user={user} />}</AgentShell>
}
