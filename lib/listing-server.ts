import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import { isListablePrice, isUuid, sortPhotos, type PhotoRow } from './listing'
import { PUBLISHED_PAYMENT_STATUSES } from './listing-fee'

export interface ListingDetail {
  id: string
  landlord_id: string
  address: string
  city: string
  state: string
  zip_code: string | null
  bedrooms: number | null
  bathrooms: number | null
  square_feet: number | null
  property_type: string | null
  description: string | null
  list_price: number
  agent_name: string | null
  photos: string[] // storage paths, cover first
}

// Anonymous server client: RLS only exposes active listings; agent names come from listing_agent_name().
function anonClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

/** A public home, or null if it doesn't exist, is inactive, is a TEST row, or isn't priced at/under the cap. */
export const getListing = cache(async (id: string): Promise<ListingDetail | null> => {
  if (!isUuid(id)) return null
  const supabase = anonClient()
  const { data, error } = await supabase
    .from('properties')
    .select('id, landlord_id, address, city, state, zip_code, bedrooms, bathrooms, square_feet, property_type, description, status, property_sale_info!inner(list_price, is_test), property_photos(storage_path, position)')
    .eq('id', id)
    .eq('status', 'active')
    .in('payment_status', [...PUBLISHED_PAYMENT_STATUSES])
    .eq('property_sale_info.is_test', false)
    .maybeSingle()
  if (error) {
    console.error('[listing] fetch failed', error.code, error.message)
    return null
  }
  if (!data) return null
  const sale = (Array.isArray(data.property_sale_info) ? data.property_sale_info[0] : data.property_sale_info) as
    | { list_price: number; is_test: boolean }
    | undefined
  if (!sale || sale.is_test || !isListablePrice(sale.list_price) || data.status !== 'active') return null

  // Profiles aren't publicly readable; this function returns only the agent's name for active listings.
  const { data: agentName, error: nameErr } = await supabase.rpc('listing_agent_name', { p_property_id: data.id })
  if (nameErr) console.warn('[listing] agent name lookup failed', nameErr.code)

  return {
    id: data.id,
    landlord_id: data.landlord_id,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zip_code,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms == null ? null : Number(data.bathrooms),
    square_feet: data.square_feet,
    property_type: data.property_type,
    description: data.description,
    list_price: sale.list_price,
    agent_name: (typeof agentName === 'string' && agentName.trim()) || null,
    photos: sortPhotos(data.property_photos as PhotoRow[] | null).map((p) => p.storage_path),
  }
})
