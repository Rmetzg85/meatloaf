'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Home, Search, Bed, Bath, MapPin, DollarSign, Loader2 } from 'lucide-react'
import Link from 'next/link'
import SiteNav from '@/COMPONENTS/SiteNav'
import SiteFooter from '@/COMPONENTS/SiteFooter'
import { THEMES } from '@/COMPONENTS/theme'
import { useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import { PRICE_CAP, isListablePrice } from '@/lib/listing'

interface Property {
  id: string
  address: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  square_feet: number | null
  monthly_rent: number
  property_type: string
  description: string | null
  available_date: string | null
  // One-to-one embed (property_sale_info.property_id is the PK), so PostgREST returns an object.
  property_sale_info: { list_price: number } | null
}

// The site only shows starter homes: a known sale price at or under $300K (rules in lib/listing.ts).
const underCap = (p: Property) => isListablePrice(p.property_sale_info?.list_price)

export default function PropertiesPage() {
  const theme = useSiteTheme()
  const t = THEMES[theme]
  const siteBg = t.sectionBg
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState('')
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    // The cap is enforced in the query; re-checked here so search can never surface anything above it.
    const q = searchCity.trim().toLowerCase()
    setFilteredProperties(
      properties.filter(
        (p) => underCap(p) && (q === '' || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)),
      ),
    )
  }, [searchCity, properties])

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        // !inner: homes without a sale-price row are dropped, and the filters below apply to the parent rows.
        .select('*, property_sale_info!inner(list_price)')
        .eq('status', 'active')
        .eq('property_sale_info.is_test', false)
        .gt('property_sale_info.list_price', 0)
        .lte('property_sale_info.list_price', PRICE_CAP)
        .order('created_at', { ascending: false })

      if (error) throw error
      const rows = ((data || []) as Property[]).filter(underCap)
      setProperties(rows)
      setFilteredProperties(rows)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${siteBg}`}>
      {/* Navigation */}
      <SiteNav />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Find Your Next Home</h1>
            <p className="text-xl text-blue-100">
              Starter homes and listings. Confirm details with the listing source.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by city or state..."
                aria-label="Search homes by city or state"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className={`w-12 h-12 animate-spin ${t.accentText}`} />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 max-w-xl mx-auto">
            <div className={`w-16 h-16 rounded-full ${t.gradient} flex items-center justify-center mx-auto mb-5`}>
              <Home className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            {searchCity ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No homes in that area yet</h2>
                <p className="text-gray-700 mb-6">Try a different city or state, or check back soon.</p>
                <button onClick={() => setSearchCity('')} className={`${t.labelText} font-semibold hover:underline`}>
                  Clear search
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">New starter homes are on the way.</h2>
                <p className="text-gray-700 mb-6">
                  Every home here will be under $300K.{' '}
                  <Link href={`${t.home}#agents`} className={`${t.labelText} font-semibold underline hover:no-underline`}>
                    Agents: list yours for $29.
                  </Link>
                </p>
                <Link href={`${t.home}#agents`} className={`inline-block ${t.gradient} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition`}>
                  List a Home
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'} Available
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {/* Property Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Home className="w-16 h-16 text-white opacity-50" />
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center ${t.labelText}`}>
                        <DollarSign className="w-5 h-5" aria-hidden="true" />
                        <span className="text-2xl font-bold">
                          {property.property_sale_info!.list_price.toLocaleString('en-US')}
                        </span>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                        {property.property_type}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start mb-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{property.address}</p>
                        <p className="text-sm text-gray-600">
                          {property.city}, {property.state}
                        </p>
                      </div>
                    </div>

                    {/* Bed/Bath */}
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.bathrooms} bath</span>
                      </div>
                      {property.square_feet && (
                        <span className="text-sm">{property.square_feet.toLocaleString()} sqft</span>
                      )}
                    </div>

                    {/* Description Preview */}
                    {property.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {property.description}
                      </p>
                    )}

                    {/* View Details Button */}
                    <span className={`block text-center w-full ${t.gradient} text-white py-2 rounded-lg font-semibold hover:opacity-90 transition`}>
                      View Details
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
