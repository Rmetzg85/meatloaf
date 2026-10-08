// app/auth/login/page.tsx
'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Loader2, MailWarning } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import BrandLink from '@/COMPONENTS/BrandLink'
import { THEMES } from '@/COMPONENTS/theme'
import { useSiteTheme } from '@/COMPONENTS/useSiteTheme'
import ResendConfirmButton from '@/COMPONENTS/ResendConfirmButton'
import { authErrorMessage, ensureProfile, isEmailNotConfirmed, landingFor, userRole } from '@/lib/auth'

export default function LoginPage() {
  const siteTheme = useSiteTheme()
  const t = THEMES[siteTheme]
  const siteBg = t.sectionBg
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  // Email of an account that exists but hasn't confirmed yet (keeps the notice on screen).
  const [unconfirmed, setUnconfirmed] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setUnconfirmed(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (isEmailNotConfirmed(error)) {
          setUnconfirmed(email)
          return
        }
        throw error
      }

      // Same landing as signup and /auth/callback.
      let destination = '/dashboard'
      if (data.user) {
        await ensureProfile(data.user)
        destination = landingFor(await userRole(data.user), siteTheme)
      }

      toast.success('Welcome back!')
      router.push(destination)
    } catch (error: unknown) {
      toast.error(authErrorMessage(error, 'Failed to login'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${siteBg} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <BrandLink className="inline-flex items-center space-x-2 mb-6" size={48} imgClassName="w-12 h-auto" nameClassName="text-3xl font-bold text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {unconfirmed && (
            <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
              <div className="flex items-start gap-3">
                <MailWarning className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="space-y-3">
                  <p>
                    <strong>Please confirm your email first.</strong> We sent a confirmation link to{' '}
                    <span className="break-words">{unconfirmed}</span> when you signed up. Click it, then sign in here.
                  </p>
                  <ResendConfirmButton email={unconfirmed} className={`${t.gradient} text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition`} />
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/auth/forgot-password" className={`text-sm ${t.labelText} hover:underline`}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className={`${t.labelText} font-semibold hover:underline`}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
