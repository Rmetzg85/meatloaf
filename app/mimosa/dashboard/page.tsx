'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Home, LogOut, TrendingUp, FileText, Trophy, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Profile {
  id: string
  full_name: string
  email: string
  user_type: string
  credit_score: number | null
  homeownership_points: number
  current_milestone: string
}

interface Application {
  id: string
  property_address: string
  monthly_rent: number
  status: string
  created_at: string
}

export default function MimosaDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const user = await getCurrentUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('future_homeowner_id', user.id)
        .order('created_at', { ascending: false })

      if (appsError) throw appsError
      setApplications(appsData || [])

    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/mimosa')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    )
  }

  if (!profile) return null

  const milestones = [
    { name: 'Getting Started', points: 0 },
    { name: 'Building Credit', points: 100 },
    { name: 'Saving for Down Payment', points: 300 },
    { name: 'Pre-Approved', points: 600 },
    { name: 'Ready to Buy', points: 1000 },
  ]

  const currentMilestoneIndex = milestones.findIndex(m => m.name === profile.current_milestone)
  const nextMilestone = milestones[currentMilestoneIndex + 1]
  const progressToNext = nextMilestone
    ? ((profile.homeownership_points - milestones[currentMilestoneIndex].points) /
       (nextMilestone.points - milestones[currentMilestoneIndex].points)) * 100
    : 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/mimosa" className="flex items-center space-x-2">
              <Image src="/mimosa-logo.svg" alt="Mimosa" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">Mimosa</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Track Her Progress — Welcome, {profile.full_name}! 👑
          </h1>
          <p className="text-gray-600">Here's your journey to homeownership</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-sm text-gray-500">Credit Score</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {profile.credit_score || '680'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {profile.credit_score ? 'Keep it up!' : 'Add your credit score'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-rose-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-rose-400" />
              </div>
              <span className="text-sm text-gray-500">Applications</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              {applications.filter(a => a.status === 'pending').length} pending
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm text-gray-500">Points</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {profile.homeownership_points}
            </p>
            <p className="text-sm text-gray-500 mt-1">Homeownership points</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Path to Homeownership</h2>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Current: {profile.current_milestone}
              </span>
              {nextMilestone && (
                <span className="text-sm text-gray-500">
                  Next: {nextMilestone.name}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-400 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {profile.homeownership_points} / {nextMilestone?.points || 1000} points
            </p>
          </div>

          <div className="space-y-3">
            {milestones.map((milestone, index) => {
              const isCompleted = profile.homeownership_points >= milestone.points
              const isCurrent = milestone.name === profile.current_milestone

              return (
                <div
                  key={milestone.name}
                  className={`flex items-center space-x-4 p-4 rounded-lg ${
                    isCompleted ? 'bg-green-50' : isCurrent ? 'bg-pink-50' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{milestone.name}</p>
                    <p className="text-sm text-gray-500">{milestone.points} points</p>
                  </div>
                  {isCompleted && (
                    <Trophy className="w-6 h-6 text-green-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h2>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No applications yet</p>
              <button className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {app.property_address}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        ${app.monthly_rent.toLocaleString()}/month
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        app.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
