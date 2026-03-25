'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Home, Search, Bed, Bath, MapPin, DollarSign, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState('')
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    if (searchCity.trim() === '') {
      setFilteredProperties(properties)
    } else {
      const filtered = properties.filter(p => 
        p.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        p.state.toLowerCase().includes(searchCity.toLowerCase())
      )
      setFilteredProperties(filtered)
    }
  }, [searchCity, properties])

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
      setFilteredProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Meatloaf" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-900">Meatloaf</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm sm:text-base">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Find Your Next Home</h1>
            <p className="text-xl text-blue-100">
              Rent smarter, build credit, achieve homeownership
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by city or state..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchCity ? 'No properties found' : 'No properties available yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchCity 
                ? 'Try searching for a different location' 
                : 'Check back soon for new listings'}
            </p>
            {searchCity && (
              <button
                onClick={() => setSearchCity('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
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
                      <div className="flex items-center text-blue-600">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-2xl font-bold">
                          {property.monthly_rent.toLocaleString()}
                        </span>
                        <span className="text-gray-600 ml-1">/mo</span>
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
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
