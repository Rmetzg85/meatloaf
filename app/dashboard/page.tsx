'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import {
  Home, LogOut, TrendingUp, FileText, Trophy, Loader2, Info, X,
  Flame, Zap, CheckCircle, Circle, Award, Lock
} from 'lucide-react'
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

const MILESTONES = [
  { name: 'Getting Started', points: 0 },
  { name: 'Building Credit', points: 100 },
  { name: 'Saving for Down Payment', points: 300 },
  { name: 'Pre-Approved', points: 600 },
  { name: 'Ready to Buy', points: 1000 },
]

const CREDIT_TIPS = [
  {
    title: 'Payment History is King',
    body: '35% of your FICO score is payment history. Every on-time rent payment you report is building this foundation. Consistency beats perfection — one missed payment can drop your score 50–100 points.',
  },
  {
    title: 'The 30% Rule',
    body: 'Keep your credit card balances below 30% of your credit limit. At 10% or below, you\'ll see the biggest score boost. This is the fastest lever you can pull to raise your score in 30 days.',
  },
  {
    title: 'Hard Inquiries Cost You',
    body: 'Every credit application triggers a hard inquiry, which can drop your score 5–10 points. Multiple applications in 14 days for the same loan type count as one inquiry — rate-shop strategically.',
  },
  {
    title: 'Keep Old Accounts Open',
    body: '15% of your score comes from credit history length. Keep your oldest accounts open even if unused. The average age of your accounts matters — think twice before canceling old cards.',
  },
  {
    title: 'Credit Mix Counts',
    body: 'Lenders like to see you handle different types of credit: revolving (cards) and installment (car loans). A mortgage adds the most prestigious installment loan to your profile.',
  },
  {
    title: 'The Homeowner Net Worth Gap',
    body: 'The median homeowner has 40x the net worth of a renter ($255,000 vs $6,300). That gap starts with the down payment — even 3.5% FHA loans can get you in the game early.',
  },
  {
    title: 'Score → Rate → Savings',
    body: 'Going from a 620 to a 740 credit score can save you 1–1.5% on your mortgage rate. On a $300K loan, that\'s $200+/month or $75,000+ over 30 years. Every point counts.',
  },
]

const ACHIEVEMENTS = [
  { id: 'signup', label: 'First Steps', description: 'Joined Meatloaf', emoji: '🚀', alwaysUnlocked: true },
  { id: 'streak3', label: 'On Fire', description: '3-day streak', emoji: '🔥', streakRequired: 3 },
  { id: 'points100', label: 'Point Scorer', description: 'Earned 100 points', emoji: '⭐', pointsRequired: 100 },
  { id: 'firstapp', label: 'House Hunter', description: 'Submitted first application', emoji: '📋', appsRequired: 1 },
  { id: 'points300', label: 'Credit Builder', description: 'Reached 300 points', emoji: '💳', pointsRequired: 300 },
  { id: 'points600', label: 'Pre-Approved', description: 'Reached 600 points', emoji: '🎯', pointsRequired: 600 },
  { id: 'streak30', label: 'Legendary', description: '30-day streak', emoji: '👑', streakRequired: 30 },
  { id: 'points1000', label: 'Homeowner Ready', description: 'Reached 1000 points', emoji: '🏆', pointsRequired: 1000 },
]

function getLevelInfo(points: number) {
  if (points >= 1000) return { level: 5, name: 'Homeowner Ready', color: 'from-green-500 to-emerald-600', emoji: '🏠' }
  if (points >= 600) return { level: 4, name: 'Pre-Approved', color: 'from-purple-500 to-indigo-600', emoji: '✅' }
  if (points >= 300) return { level: 3, name: 'Down Payment Saver', color: 'from-blue-500 to-cyan-600', emoji: '💰' }
  if (points >= 100) return { level: 2, name: 'Credit Builder', color: 'from-yellow-500 to-orange-500', emoji: '📈' }
  return { level: 1, name: 'House Hunter', color: 'from-gray-400 to-gray-500', emoji: '🔍' }
}

const DAILY_GOAL = 50

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [streak, setStreak] = useState(0)
  const [dailyXP, setDailyXP] = useState(0)
  const [completedMissions, setCompletedMissions] = useState<string[]>([])
  const [activeTip, setActiveTip] = useState<number | null>(null)
  const profileRef = useRef<Profile | null>(null)
  const completedRef = useRef<string[]>([])
  const dailyXPRef = useRef(0)

  const todayKey = new Date().toISOString().split('T')[0]
  const tipIndex = new Date().getDate() % CREDIT_TIPS.length

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (profileError) throw profileError

      profileRef.current = profileData
      setProfile(profileData)

      const { data: appsData, error: appsError } = await supabase
        .from('applications').select('*')
        .eq('future_homeowner_id', user.id)
        .order('created_at', { ascending: false })
      if (appsError) throw appsError
      setApplications(appsData || [])

      initDailyProgress(profileData)
    } catch (error: unknown) {
      console.error('Error:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const initDailyProgress = (profileData: Profile) => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const lastLogin = localStorage.getItem('ml_lastLogin')
    const currentStreak = parseInt(localStorage.getItem('ml_streak') || '0')
    const todayXP = parseInt(localStorage.getItem(`ml_xp_${todayKey}`) || '0')
    const todayMissions: string[] = JSON.parse(localStorage.getItem(`ml_missions_${todayKey}`) || '[]')

    let newStreak = currentStreak
    if (lastLogin === todayKey) {
      newStreak = currentStreak
    } else if (lastLogin === yesterday) {
      newStreak = currentStreak + 1
    } else {
      newStreak = 1
    }

    localStorage.setItem('ml_streak', newStreak.toString())
    localStorage.setItem('ml_lastLogin', todayKey)
    setStreak(newStreak)
    setDailyXP(todayXP)
    dailyXPRef.current = todayXP
    setCompletedMissions(todayMissions)
    completedRef.current = todayMissions

    if (!todayMissions.includes('checkin')) {
      awardMission('checkin', 10, todayMissions, todayXP, profileData)
    }
  }

  const awardMission = async (
    missionId: string,
    xp: number,
    currentMissions: string[],
    currentXP: number,
    profileData: Profile
  ) => {
    if (currentMissions.includes(missionId)) return

    const newMissions = [...currentMissions, missionId]
    localStorage.setItem(`ml_missions_${todayKey}`, JSON.stringify(newMissions))
    setCompletedMissions(newMissions)
    completedRef.current = newMissions

    const newXP = currentXP + xp
    localStorage.setItem(`ml_xp_${todayKey}`, newXP.toString())
    setDailyXP(newXP)
    dailyXPRef.current = newXP

    const newPoints = profileData.homeownership_points + xp
    const newMilestone = MILESTONES.reduce((best, m) =>
      newPoints >= m.points ? m : best, MILESTONES[0])

    await supabase.from('profiles').update({
      homeownership_points: newPoints,
      current_milestone: newMilestone.name,
    }).eq('id', profileData.id)

    const updatedProfile = { ...profileData, homeownership_points: newPoints, current_milestone: newMilestone.name }
    profileRef.current = updatedProfile
    setProfile(updatedProfile)

    if (missionId !== 'checkin') {
      toast.success(`+${xp} XP earned!`, { icon: '⚡' })
    }
  }

  const handleMissionClick = async (missionId: string, xp: number) => {
    const currentProfile = profileRef.current
    if (!currentProfile || completedRef.current.includes(missionId)) return

    if (missionId === 'learn') {
      setActiveTip(tipIndex)
      return
    }

    if (missionId === 'browse') {
      await awardMission(missionId, xp, completedRef.current, dailyXPRef.current, currentProfile)
      router.push('/properties')
      return
    }

    if (missionId === 'share') {
      const url = 'https://meatloaf.rent'
      if (navigator.share) {
        navigator.share({ title: 'Meatloaf', text: 'Build credit, own your first home.', url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied!', { icon: '🔗' })
      }
      await awardMission(missionId, xp, completedRef.current, dailyXPRef.current, currentProfile)
      return
    }

    await awardMission(missionId, xp, completedRef.current, dailyXPRef.current, currentProfile)
  }

  const handleTipRead = async () => {
    const currentProfile = profileRef.current
    if (!currentProfile) return
    setActiveTip(null)
    if (!completedRef.current.includes('learn')) {
      await awardMission('learn', 15, completedRef.current, dailyXPRef.current, currentProfile)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch {
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

  const levelInfo = getLevelInfo(profile.homeownership_points)
  const dailyProgress = Math.min((dailyXP / DAILY_GOAL) * 100, 100)
  const dailyGoalMet = dailyXP >= DAILY_GOAL

  const currentMilestoneIndex = Math.max(0, MILESTONES.findIndex(m => m.name === profile.current_milestone))
  const nextMilestone = MILESTONES[currentMilestoneIndex + 1]
  const progressToNext = nextMilestone
    ? ((profile.homeownership_points - MILESTONES[currentMilestoneIndex].points) /
      (nextMilestone.points - MILESTONES[currentMilestoneIndex].points)) * 100
    : 100

  const dailyMissions = [
    { id: 'checkin', label: 'Daily Check-in', description: 'Open your dashboard', xp: 10, icon: '📅' },
    { id: 'learn', label: 'Read Credit Tip', description: CREDIT_TIPS[tipIndex].title, xp: 15, icon: '📚' },
    { id: 'browse', label: 'Browse Properties', description: 'Explore rental listings', xp: 20, icon: '🏘️' },
    { id: 'share', label: 'Spread the Word', description: 'Share Meatloaf with a friend', xp: 25, icon: '🔗' },
  ]

  const isAchievementUnlocked = (a: typeof ACHIEVEMENTS[0]) => {
    if (a.alwaysUnlocked) return true
    if ('pointsRequired' in a && a.pointsRequired !== undefined && profile.homeownership_points >= a.pointsRequired) return true
    if ('streakRequired' in a && a.streakRequired !== undefined && streak >= a.streakRequired) return true
    if ('appsRequired' in a && a.appsRequired !== undefined && applications.length >= a.appsRequired) return true
    return false
  }

  const unlockedCount = ACHIEVEMENTS.filter(isAchievementUnlocked).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Meatloaf" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-900">Meatloaf</span>
            </Link>
            {/* Desktop stats strip */}
            <div className="hidden md:flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-gray-900">{streak}</span>
                <span className="text-sm text-gray-500">day streak</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900">{dailyXP}</span>
                <span className="text-sm text-gray-500">XP today</span>
              </div>
              <div className={`bg-gradient-to-r ${levelInfo.color} text-white px-3 py-1.5 rounded-full text-sm font-bold`}>
                Lv.{levelInfo.level} · {levelInfo.name}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Credit Tip Modal */}
      {activeTip !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActiveTip(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">📚</div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 py-1 text-sm font-semibold inline-block mb-3">
                Credit Tip of the Day
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{CREDIT_TIPS[activeTip].title}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-center mb-8">{CREDIT_TIPS[activeTip].body}</p>
            <button
              onClick={handleTipRead}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Got it! Claim +15 XP
            </button>
          </div>
        </div>
      )}

      {/* Philosophy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-5 mb-6">
              <h2 className="text-xl font-bold">Why Homeownership &gt; College Degree</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>We believe homeownership is the new college degree. Here&apos;s why:</p>
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
                Your family should celebrate your first home closing with the same pride they&apos;d celebrate a college graduation. That&apos;s the future we&apos;re building.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Hey, {profile.full_name?.split(' ')[0] ?? 'there'}! {streak > 1 ? '🔥' : '👋'}
            </h1>
            <button
              onClick={() => setModalOpen(true)}
              className="text-blue-400 hover:text-blue-600 transition"
              aria-label="Why homeownership matters"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-500">
            {dailyGoalMet
              ? `Daily goal crushed! You earned ${dailyXP} XP today. 🎉`
              : `${DAILY_GOAL - dailyXP} XP to hit your daily goal.`}
          </p>
        </div>

        {/* Mobile streak strip */}
        <div className="flex md:hidden items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-orange-700 text-sm">{streak} day streak</span>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-yellow-700 text-sm">{dailyXP} XP</span>
          </div>
        </div>

        {/* Daily Goal + Quests */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

          {/* Daily XP Ring */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-gray-900 text-lg mb-5">Daily Goal</h3>
            <div className="relative w-40 h-40 mb-5">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="66" fill="none" stroke="#e5e7eb" strokeWidth="14" />
                <circle
                  cx="80" cy="80" r="66"
                  fill="none"
                  stroke="url(#xpGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 66}`}
                  strokeDashoffset={`${2 * Math.PI * 66 * (1 - dailyProgress / 100)}`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-500 mb-1" />
                <span className="text-3xl font-black text-gray-900">{dailyXP}</span>
                <span className="text-xs text-gray-400">/ {DAILY_GOAL} XP</span>
              </div>
            </div>
            {dailyGoalMet ? (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 w-full">
                <p className="text-green-700 font-bold text-sm">🎉 Daily goal complete!</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">{DAILY_GOAL - dailyXP} XP to reach your goal</p>
            )}
            {streak > 0 && (
              <div className="mt-4 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 w-full justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-700">{streak} day streak!</span>
              </div>
            )}
          </div>

          {/* Daily Quests */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Daily Quests</h3>
              <span className="text-sm text-gray-400">
                {completedMissions.length}/{dailyMissions.length} done
              </span>
            </div>
            <div className="space-y-3">
              {dailyMissions.map((mission) => {
                const done = completedMissions.includes(mission.id)
                return (
                  <button
                    key={mission.id}
                    onClick={() => handleMissionClick(mission.id, mission.xp)}
                    disabled={done}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${done
                      ? 'bg-green-50 border-green-200 opacity-80 cursor-default'
                      : 'bg-gray-50 border-transparent hover:border-blue-200 hover:bg-blue-50 cursor-pointer'
                      }`}
                  >
                    <span className="text-2xl">{mission.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold ${done ? 'text-green-700' : 'text-gray-900'}`}>
                        {mission.label}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{mission.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-sm font-bold ${done ? 'text-green-600' : 'text-yellow-600'}`}>
                        +{mission.xp} XP
                      </span>
                      {done
                        ? <CheckCircle className="w-6 h-6 text-green-500" />
                        : <Circle className="w-6 h-6 text-gray-300" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Credit Score</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{profile.credit_score ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">{profile.credit_score ? 'Keep it up!' : 'Add your score'}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Applications</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
            <p className="text-sm text-gray-500 mt-1">{applications.filter(a => a.status === 'pending').length} pending</p>
          </div>

          <div className={`bg-gradient-to-br ${levelInfo.color} rounded-2xl shadow-lg p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-white/80">Level {levelInfo.level}</span>
            </div>
            <p className="text-3xl font-bold">{profile.homeownership_points}</p>
            <p className="text-sm text-white/80 mt-1">{levelInfo.emoji} {levelInfo.name}</p>
          </div>
        </div>

        {/* Path to Homeownership */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Path to Homeownership</h2>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Current: {profile.current_milestone}</span>
              {nextMilestone && (
                <span className="text-sm text-gray-500">Next: {nextMilestone.name}</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {profile.homeownership_points} / {nextMilestone?.points || 1000} points
            </p>
          </div>

          <div className="space-y-3">
            {MILESTONES.map((milestone, index) => {
              const isCompleted = profile.homeownership_points >= milestone.points
              const isCurrent = milestone.name === profile.current_milestone
              return (
                <div
                  key={milestone.name}
                  className={`flex items-center space-x-4 p-4 rounded-lg ${isCompleted ? 'bg-green-50' : isCurrent ? 'bg-blue-50' : 'bg-gray-50'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                    }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{milestone.name}</p>
                    <p className="text-sm text-gray-500">{milestone.points} points</p>
                  </div>
                  {isCompleted && <Trophy className="w-6 h-6 text-green-500" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
            <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
              {unlockedCount}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = isAchievementUnlocked(achievement)
              return (
                <div
                  key={achievement.id}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 text-center transition ${unlocked
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-100 bg-gray-50 opacity-50'
                    }`}
                >
                  <div className="text-4xl mb-2">
                    {unlocked ? achievement.emoji : <Lock className="w-8 h-8 text-gray-300 mx-auto" />}
                  </div>
                  <p className={`font-bold text-sm ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                    {achievement.label}
                  </p>
                  <p className={`text-xs mt-1 ${unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No applications yet</p>
              <Link
                href="/properties"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{app.property_address}</h3>
                      <p className="text-gray-600 mt-1">${app.monthly_rent.toLocaleString()}/month</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${app.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : app.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
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
