'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function LandlordsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/properties" className="text-gray-700 hover:text-gray-900 font-medium">
                Browse Properties
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
                About
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/mimosa" className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-50 transition">
                Switch to Mimosa →
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Future Homeowner
              </Link>
            </div>
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col space-y-4">
            <Link href="/properties" className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Browse Properties</Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link href="/mimosa" className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-2 rounded-full hover:bg-pink-50 transition text-center" onClick={() => setMobileMenuOpen(false)}>Switch to Mimosa →</Link>
            <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition text-center" onClick={() => setMobileMenuOpen(false)}>Future Homeowner</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">For Landlords</h1>
          <p className="text-xl text-blue-200 font-semibold">Launching Q3 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Pre-Qualified Tenants Who Are Building Credit
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Meatloaf tenants are motivated renters on a mission to build credit and buy a home. That makes them your best tenants.
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Benefits</h3>
            <ul className="space-y-4">
              {[
                'Automatic rent reporting reduces disputes',
                'Lower vacancy rates with motivated renters',
                'Tenant credit tracking dashboard',
                'Quality tenants who stay longer',
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-gray-200 rounded-2xl p-8 mb-10">
            <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">Pricing</p>
            <p className="text-4xl font-black text-gray-900 mb-1">$75<span className="text-xl font-normal text-gray-500">/month</span></p>
            <p className="text-gray-500">when we launch</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-2">Join the waitlist to be first in line.</h3>
            <p className="text-gray-400 mb-6">We'll reach out before we launch in your market.</p>
            {submitted ? (
              <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-green-300 font-semibold">
                ✓ You're on the list! We'll be in touch.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo.png" alt="Meatloaf" width={32} height={32} className="h-8 w-auto" />
                <span className="text-xl font-bold">Meatloaf</span>
              </div>
              <p className="text-gray-400 text-sm">Stop renting forever. Build credit. Own your home.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/properties" className="hover:text-white transition">Browse Properties</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Business</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/landlords" className="hover:text-white transition">Landlords</Link></li>
                <li><Link href="/agents" className="hover:text-white transition">Real Estate Agents</Link></li>
                <li><Link href="/lenders" className="hover:text-white transition">Mortgage Lenders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm mb-2"><a href="https://Meatloaf.Rent" className="hover:text-white transition">Meatloaf.Rent</a></p>
              <p className="text-gray-400 text-sm mb-2"><a href="mailto:RMetzgar@REMVentures.Tech" className="hover:text-white transition">RMetzgar@REMVentures.Tech</a></p>
              <p className="text-gray-400 text-sm">Baltimore, MD & Washington, DC</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2025 REMVentures LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
