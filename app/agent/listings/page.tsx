'use client'

import Link from 'next/link'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Bath, BedDouble, CreditCard, Eye, Loader2, Pencil, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'
import AgentShell from '@/COMPONENTS/agent/AgentShell'
import { ListingPhoto } from '@/COMPONENTS/ListingPhoto'
import { THEMES } from '@/COMPONENTS/theme'
import ThemeSetter from '@/COMPONENTS/ThemeSetter'
import { useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import { supabase } from '@/lib/supabase'
import { formatBaths, formatPrice, isListablePrice, sortPhotos, type PhotoRow } from '@/lib/listing'
import { LISTING_FEE_LABEL, isPublished } from '@/lib/listing-fee'
import { confirmListingCheckout, listingFeeRequired, startListingCheckout } from '@/lib/listing-checkout'

interface Row {
  id: string
  address: string
  city: string
  state: string
  status: string
  payment_status: string
  bedrooms: number | null
  bathrooms: number | null
  property_sale_info: { list_price: number; is_test: boolean } | null
  property_photos: PhotoRow[] | null
}

const STATUS_LABEL: Record<string, string> = { active: 'Active', inactive: 'Draft', pending: 'Pending', sold: 'Sold', rented: 'Rented' }

function MyListings({ user }: { user: User }) {
  const themeKey = useSiteTheme()
  const t = THEMES[themeKey]
  const params = useSearchParams()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [feeOn, setFeeOn] = useState(false)
  const [paying, setPaying] = useState<string | null>(null)
  const handledReturn = useRef(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('id, address, city, state, status, payment_status, bedrooms, bathrooms, property_sale_info(list_price, is_test), property_photos(storage_path, position)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })
    if (error) { console.error('[listings] load failed', error.code); setFailed(true) }
    setRows((data ?? []) as unknown as Row[])
    return (data ?? []) as unknown as Row[]
  }, [user.id])

  useEffect(() => {
    // load() only sets state after its query resolves.
    void Promise.resolve().then(load)
    listingFeeRequired().then(setFeeOn)
  }, [load])

  // Back from Stripe Checkout (?paid=<listing>&session_id=... or ?canceled=<listing>).
  useEffect(() => {
    if (handledReturn.current) return
    const paidId = params.get('paid')
    const sessionId = params.get('session_id')
    const canceledId = params.get('canceled')
    if (!paidId && !canceledId) return
    handledReturn.current = true
    window.history.replaceState(null, '', '/agent/listings')
    if (canceledId) {
      toast(`Checkout canceled. Your listing is saved but stays hidden until the ${LISTING_FEE_LABEL} is paid.`)
      return
    }
    ;(async () => {
      const id = toast.loading('Payment received. Publishing your listing…')
      // The webhook usually wins; the confirm call covers a slow webhook.
      if (sessionId) await confirmListingCheckout(sessionId)
      for (let i = 0; i < 6; i++) {
        const fresh = await load()
        if (fresh.find((r) => r.id === paidId)?.payment_status === 'paid') {
          toast.success('Paid! Your listing is live.', { id })
          return
        }
        await new Promise((r) => setTimeout(r, 2000))
      }
      toast.success('Payment received. Your listing will go live in a minute; refresh to check.', { id })
    })()
  }, [params, load])

  const pay = async (listingId: string) => {
    setPaying(listingId)
    const err = await startListingCheckout(listingId, themeKey)
    if (err) {
      toast.error(err.error)
      setPaying(null)
      if (err.alreadyPaid) load()
    }
  }

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
            const isPublic = isPublished(r.status, r.payment_status) && !isTest && isListablePrice(sale?.list_price)
            const unpaid = r.payment_status === 'unpaid' && !isTest
            const baths = formatBaths(r.bathrooms == null ? null : Number(r.bathrooms))
            return (
              <li key={r.id} className="rounded-2xl bg-white shadow-lg overflow-hidden flex flex-col sm:flex-row">
                <ListingPhoto path={sortPhotos(r.property_photos)[0]?.storage_path} alt={`${r.address}, ${r.city}, ${r.state}`} className="h-40 sm:h-auto sm:w-56 shrink-0" label="" />
                <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPublic ? 'bg-green-100 text-green-800' : unpaid ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-700'}`}>
                      {isTest ? 'TEST (hidden)' : isPublic ? 'Live' : unpaid ? 'Hidden: awaiting payment' : STATUS_LABEL[r.status] ?? r.status}
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
                    {unpaid && (
                      <button
                        type="button"
                        onClick={() => pay(r.id)}
                        disabled={!!paying}
                        className={`inline-flex items-center gap-1.5 rounded-lg ${t.gradient} px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60`}
                      >
                        {paying === r.id ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <CreditCard className="w-4 h-4" aria-hidden="true" />}
                        Pay {LISTING_FEE_LABEL} to publish
                      </button>
                    )}
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
        {feeOn
          ? `Flat ${LISTING_FEE_LABEL} per listing, paid securely through Stripe. No referral fees or commissions. Listings must comply with fair housing law.`
          : 'Founding rate: $29 per home for 90 days. Online checkout isn’t live yet; nothing is charged here. Listings must comply with fair housing law.'}
      </p>
    </div>
  )
}

function ReturnTheme() {
  const theme = useSearchParams().get('theme')
  return theme === 'mimosa' || theme === 'meatloaf' ? <ThemeSetter theme={theme} /> : null
}

export default function AgentListingsPage() {
  return (
    <>
      <Suspense fallback={null}><ReturnTheme /></Suspense>
      <AgentShell>{(user) => <Suspense fallback={null}><MyListings user={user} /></Suspense>}</AgentShell>
    </>
  )
}
