'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Home, LogOut, TrendingUp, FileText, Trophy, Loader2, Info, X } from 'lucide-react'
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

const motivationalQuotes = [
  "Homeowners have 40x the net worth of renters. You're on the right path.",
  "Your parents celebrated a diploma. Your kids will celebrate your equity.",
  "Every rent payment is building your credit. Every credit point is building your future.",
  "College debt: -$50K. Home equity at 30: +$60K. You chose wisely.",
  "The diploma got you the job. The house builds generational wealth.",
  "70% of millionaires built wealth through real estate. You're learning early.",
]

const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

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
      router.push('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Meatloaf" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-900">Meatloaf</span>
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

      {/* Philosophy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-5 mb-6">
              <h2 className="text-xl font-bold">Why Homeownership &gt; College Degree</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>We believe homeownership is the new college degree. Here's why:</p>
              <ul className="space-y-2 mt-3">
                {[
                  '70% of millionaires built wealth through real estate',
                  'Homeowners have 40x the net worth of renters',
                  'College: 4 years, $120K debt, uncertain ROI',
                  'Homeownership: Forced savings, tax advantages, equity appreciation',
                  'A home is an asset. A degree is credentials.',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="pt-2 font-semibold text-gray-900">Education opens doors. Ownership builds generational wealth.</p>
              <p className="text-gray-600 text-sm">
                Your family should celebrate your first home closing with the same pride they'd celebrate a college graduation. That's the future we're building.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {profile.full_name}! 👋
            </h1>
            <button
              onClick={() => setModalOpen(true)}
              className="text-blue-400 hover:text-blue-600 transition flex-shrink-0"
              aria-label="Why homeownership matters"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">Here's your journey to homeownership</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl px-5 py-4">
            <p className="text-gray-600 text-sm italic">"{randomQuote}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
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
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
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
              <div className="bg-green-100 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all"
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
                    isCompleted ? 'bg-green-50' : isCurrent ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
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
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
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

