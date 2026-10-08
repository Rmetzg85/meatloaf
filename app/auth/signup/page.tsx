// app/auth/signup/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Home, Mail, Lock, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import BrandLink from '@/COMPONENTS/BrandLink'
import { useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import { THEMES } from '@/COMPONENTS/theme'

export default function SignupPage() {
  const siteTheme = useSiteTheme()
  const t = THEMES[siteTheme]
  const siteBg = t.sectionBg
  const router = useRouter()
  const brand = t.name
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'future homeowner' | 'realestateagent'>('future homeowner')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      })

      if (authError) throw authError

      // Attempt to upsert profile — may fail if email confirmation is required
      // (session not yet established). The DB trigger or first-login will handle it.
      if (authData.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: authData.user.email,
            full_name: fullName,
            user_type: userType,
          })
        // Ignore RLS / upsert errors here — profile is created by DB trigger or on first login
      }

      toast.success(`Account created! Welcome to ${brand}!`)
      // Agents go to the "List a Home" section of their brand's homepage
      // (listing is handled by email at the founding rate for now).
      const destination = userType === 'realestateagent' ? `${t.home}#agents` : '/dashboard'
      router.push(destination)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${siteBg} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <BrandLink className="inline-flex items-center space-x-2 mb-6" size={48} imgClassName="w-12 h-auto" nameClassName="text-3xl font-bold text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join {brand} today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('future homeowner')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                    userType === 'future homeowner'
                      ? `${t.accentBorder} ${t.softBg} ${t.labelText}`
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Future Homeowner
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('realestateagent')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                    userType === 'realestateagent'
                      ? `${t.accentBorder} ${t.softBg} ${t.labelText}`
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Real Estate Agent
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${t.gradient} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className={`${t.labelText} font-semibold hover:underline`}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
