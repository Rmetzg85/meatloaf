'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Home, MapPin, Bed, Bath, Ruler, DollarSign, Calendar, ArrowLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip_code: string
  bedrooms: number
  bathrooms: number
  square_feet: number | null
  property_type: string
  monthly_rent: number
  security_deposit: number | null
  description: string | null
  available_date: string | null
  landlord_id: string
}

interface Profile {
  full_name: string
  email: string
}

export default function PropertyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [landlord, setLandlord] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetchPropertyAndLandlord()
    checkCurrentUser()
  }, [propertyId])

  const checkCurrentUser = async () => {
    const user = await getCurrentUser()
    setCurrentUser(user)
  }

  const fetchPropertyAndLandlord = async () => {
    try {
      // Fetch property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

      if (propertyError) throw propertyError
      setProperty(propertyData)

      // Fetch landlord profile
      const { data: landlordData, error: landlordError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', propertyData.landlord_id)
        .single()

      if (landlordError) throw landlordError
      setLandlord(landlordData)

    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!currentUser) {
      toast.error('Please log in to apply')
      router.push('/auth/login')
      return
    }

    setApplying(true)

    try {
      // Check if already applied
      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('renter_id', currentUser.id)
        .eq('property_address', property!.address)
        .single()

      if (existingApp) {
        toast.error('You have already applied to this property')
        setApplying(false)
        return
      }

      // Create application
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            renter_id: currentUser.id,
            property_address: `${property!.address}, ${property!.city}, ${property!.state}`,
            monthly_rent: property!.monthly_rent,
            status: 'pending',
          },
        ])

      if (error) throw error

      toast.success('Application submitted successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <Link href="/properties" className="text-blue-600 hover:text-blue-700">
            Back to Properties
          </Link>
        </div>
      </div>
    )
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
              {currentUser ? (
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/properties"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Properties
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Property Image Placeholder */}
          <div className="h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Home className="w-32 h-32 text-white opacity-50" />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {property.address}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {property.city}, {property.state} {property.zip_code}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-blue-600 justify-end">
                  <DollarSign className="w-8 h-8" />
                  <span className="text-4xl font-bold">
                    {property.monthly_rent.toLocaleString()}
                  </span>
                </div>
                <span className="text-gray-600">per month</span>
              </div>
            </div>

            {/* Property Type Badge */}
            <div className="mb-6">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {property.property_type}
              </span>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="text-center">
                <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                <p className="text-sm text-gray-600">Bedrooms</p>
              </div>
              <div className="text-center">
                <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                <p className="text-sm text-gray-600">Bathrooms</p>
              </div>
              {property.square_feet && (
                <div className="text-center">
                  <Ruler className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {property.square_feet.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Sq Ft</p>
                </div>
              )}
              {property.security_deposit && (
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    ${property.security_deposit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Security Deposit</p>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            )}

            {/* Available Date */}
            {property.available_date && (
              <div className="mb-8 flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  Available from: {new Date(property.available_date).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Landlord Info */}
            {landlord && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Owner</h3>
                <p className="text-gray-700">{landlord.full_name}</p>
                <p className="text-gray-600 text-sm">{landlord.email}</p>
              </div>
            )}

            {/* Apply Button */}
            <div className="flex justify-end">
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center"
              >
                {applying ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
