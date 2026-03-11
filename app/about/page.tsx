'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, TrendingUp, Users, Target, Shield, Zap } from 'lucide-react'

export default function AboutPage() {
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
            <div className="flex items-center space-x-6">
              <Link href="/properties" className="text-gray-700 hover:text-gray-900 font-medium">
                Browse Properties
              </Link>
              <Link href="/about" className="text-gray-900 font-bold">
                About
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Meatloaf</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            We're building the complete ecosystem to help 8 million men and women transition from mom's basement to homeownership.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Stop letting rent payments disappear into thin air. Every dollar you pay should work toward building your financial future.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Right now, 15 million men ages 25-34 are stuck living with their parents. They're not lazy. They're not irresponsible. They make decent money and want to build a life. But the system is designed to keep them stuck.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Living with parents means zero rent payments, which means zero credit building. Moving out and paying $2,000/month in rent? Those payments still don't count toward your credit score. The largest monthly expense most Americans have, and it's invisible to lenders.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              <strong className="text-gray-900">Meatloaf changes that.</strong> We turn rent payments into credit scores, and credit scores into homes.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">The Broken System</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rent Doesn't Build Credit</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You pay $2,000 every month. On time. For years. But those payments are invisible to credit bureaus. The largest expense most Americans have, and it doesn't count.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Meanwhile, a $500 credit card payment gets reported immediately. The system rewards debt over responsibility.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Credit Score Lie</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You check Credit Karma: 740. You feel great. You apply for a mortgage. The lender pulls your FICO score: 680. Denied.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The 30-60 point gap between VantageScore (what Credit Karma shows) and FICO (what lenders use) keeps 44 million Americans stuck renting.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Disconnected Platforms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Browse properties on Zillow. Check credit on Credit Karma (wrong score). Apply on different landlord sites. Track nothing.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The rental and real estate industry is a mess of disconnected tools that don't talk to each other. Nobody wins.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Clear Path</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You want to buy a home. But how? How many points do you need? What actions actually help? How long will it take?
              </p>
              <p className="text-gray-700 leading-relaxed">
                No roadmap. No tracking. No motivation. Just endless years of rent with nothing to show for it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">The Meatloaf Solution</h2>
          
          <div className="space-y-12">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Four-Sided Marketplace</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    We connect future owners, landlords, investors, and lenders in one ecosystem. Browse verified properties. Apply with one click. Get matched with quality landlords who report rent payments.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatic Rent Reporting</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Connect your bank account. We verify your rent payments automatically and report them to all three credit bureaus via Pinwheel API. Your payment history becomes your credit data.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Gamified Credit Building</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Your credit score becomes your game level. Daily missions keep you motivated. Achievements reward your progress. AI coaching guides your next steps.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed italic">
                    It's Duolingo for credit scores.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Clear Path to Homeownership</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    See exactly how many points you need to hit 720 for pre-approval. Track your progress in real time. When you're ready, unlock lender partnerships. The platform that helped you rent now helps you buy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why This Matters</h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Homeownership Is the New College Degree</h3>
            
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                <strong className="text-gray-900">Traditional "Success" Path:</strong> 4-year college degree costs $120,000 in debt. Starting salary: $55,000/year. Time to break even: 10+ years. ROI: Uncertain.
              </p>
              
              <p>
                <strong className="text-gray-900">Homeownership Path:</strong> Down payment: $15,000 (5% on $300K home). Monthly payment: $2,000 (same as rent). Home appreciation: 4-6% annually. After 5 years: $60,000+ in equity. ROI: Tangible wealth.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded my-8">
                <p className="font-semibold text-gray-900 text-xl mb-2">The Reality:</p>
                <ul className="space-y-2">
                  <li>• 70% of millionaires built wealth through real estate</li>
                  <li>• Homeowners have 40x the net worth of renters</li>
                  <li>• A home is forced savings, tax advantages, and stability</li>
                  <li>• College debt cripples; home equity builds</li>
                </ul>
              </div>
              
              <p>
                <strong className="text-gray-900">Yet 44 million Americans are stuck renting</strong> because the system is designed to keep them there.
              </p>
              
              <p className="text-xl font-semibold text-gray-900 mt-8">
                Education opens doors. Homeownership builds generational wealth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">The Founder</h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ryan Metzgar</h3>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Ryan founded Meatloaf after watching friends pay $2,000/month in rent for years with nothing to show for it. Meanwhile, Credit Karma told them their scores were "good enough" — until they applied for mortgages and discovered their REAL FICO scores were 40-60 points lower.
              </p>
              
              <p>
                Self-taught developer who went from zero coding experience to shipping production software in 12 months using AI assistance. Built the entire Meatloaf platform from scratch.
              </p>
              
              <p className="font-semibold text-gray-900 text-xl pt-4">
                "The system is broken. We're fixing it."
              </p>
              
              <p>
                Meatloaf isn't just another rental site. It's a movement to help renters build wealth, credit, and stability — the same opportunities previous generations took for granted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">By The Numbers</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">15M</div>
              <p className="text-blue-100">Men ages 25-34 with parents</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">44M</div>
              <p className="text-blue-100">Americans stuck renting</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">$240K</div>
              <p className="text-blue-100">Lifetime rent (zero equity)</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">40x</div>
              <p className="text-blue-100">Homeowner vs renter net worth</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Join The Movement</h2>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Whether you're a renter tired of throwing money away, a landlord seeking quality tenants, an investor looking for opportunities, or a lender wanting better borrowers — Meatloaf connects you.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition transform hover:-translate-y-1 shadow-xl"
          >
            Get Started Free
          </Link>
          <p className="text-gray-600 mt-6">Launching Q1 2026 in Baltimore & Washington DC</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo.png" alt="Meatloaf" width={32} height={32} className="h-8 w-auto" />
                <span className="text-xl font-bold">Meatloaf</span>
              </div>
              <p className="text-gray-400 text-sm">
                Stop renting forever. Build credit. Own your home.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/properties" className="hover:text-white transition">Browse Properties</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
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
              <p className="text-gray-400 text-sm mb-2">rmetzgar@remventures.tech</p>
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