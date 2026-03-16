'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Home, TrendingUp, Award, Target, ChevronRight, Zap, Shield, Users, Menu, X } from 'lucide-react'

export default function MimosaHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/mimosa" className="flex items-center space-x-2">
              <Image src="/mimosa-logo.svg" alt="Mimosa" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">Mimosa</span>
            </Link>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/properties" className="text-gray-700 hover:text-gray-900 font-medium">
                Browse Properties
              </Link>
              <Link href="/mimosa/about" className="text-gray-700 hover:text-gray-900 font-medium">
                About
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/" className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-50 transition">
                Switch to Meatloaf →
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Future Homeowner
              </Link>
            </div>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col space-y-4">
            <Link href="/properties" className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Browse Properties
            </Link>
            <Link href="/mimosa/about" className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link href="/" className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-2 rounded-full hover:bg-pink-50 transition text-center" onClick={() => setMobileMenuOpen(false)}>
              Switch to Meatloaf →
            </Link>
            <Link href="/auth/signup" className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition text-center" onClick={() => setMobileMenuOpen(false)}>
              Future Homeowner
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                Hungover.<br />Childhood Bedroom.<br />Dad's Texting Again.
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-amber-200 mb-6">
                You went to brunch. Had too many mimosas. Put it on his card. You're 28, working hard — and still somehow here.
              </p>
              <div className="text-left bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-10 space-y-4 text-pink-50 text-lg leading-relaxed">
                <p>
                  The same curtains from middle school. The notification: "You used my card again?" Brunch was worth it — the situation is not. You're smart, ambitious, capable. But no one ever showed you the credit-to-ownership pipeline, and now you're paying rent that builds zero points on your FICO while someone else builds equity on your payments.
                </p>
                <p className="font-semibold text-white">
                  AI is rewriting every career. A $120K degree might be obsolete before you pay it off. The women winning in the new economy aren't the most credentialed — they're the ones who started building real assets early.
                </p>
                <p className="text-amber-200 font-bold text-xl">
                  Real wealth starts with a roof you own. Build credit now. Level up fast. Buy your first home before 30.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  Start Building Credit
                </Link>
                <Link
                  href="/properties"
                  className="bg-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-pink-700 transition border-2 border-white/30"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Path Comparison Section */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            Two Paths. One Winner.
          </h2>
          <p className="text-center text-gray-400 text-xl mb-14">
            Pick the one that builds wealth — not debt.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Path */}
            <div className="bg-gray-900 border border-red-500/40 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">🎓</span>
                <h3 className="text-2xl font-black text-red-400">The Traditional Path</h3>
              </div>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span className="text-red-500 font-bold text-sm whitespace-nowrap pt-0.5">Age 18–22</span>
                  <span className="text-gray-300">College <span className="text-red-400 font-semibold">(-$120,000 in debt)</span></span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-500 font-bold text-sm whitespace-nowrap pt-0.5">Age 22–25</span>
                  <span className="text-gray-300">Paying off student loans</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-500 font-bold text-sm whitespace-nowrap pt-0.5">Age 25–30</span>
                  <span className="text-gray-300">Renting, zero equity</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-red-500 font-bold text-sm whitespace-nowrap pt-0.5">Age 30</span>
                  <span className="text-gray-300">Maybe thinking about buying</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-gray-700 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total equity</span>
                  <span className="text-red-400 font-black text-lg">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Net worth impact</span>
                  <span className="text-red-400 font-black text-lg">Negative for 10+ years</span>
                </div>
              </div>
            </div>

            {/* Mimosa Path */}
            <div className="bg-gradient-to-br from-pink-900 to-rose-900 border border-pink-400/40 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">🏠</span>
                <h3 className="text-2xl font-black text-pink-300">The Mimosa Path</h3>
              </div>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span className="text-pink-400 font-bold text-sm whitespace-nowrap pt-0.5">Age 16–18</span>
                  <span className="text-gray-200">Credit Starters <span className="text-green-400 font-semibold">(2 years history)</span></span>
                </li>
                <li className="flex gap-4">
                  <span className="text-pink-400 font-bold text-sm whitespace-nowrap pt-0.5">Age 18–22</span>
                  <span className="text-gray-200">Launch Pad + work / community college</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-pink-400 font-bold text-sm whitespace-nowrap pt-0.5">Age 22</span>
                  <span className="text-gray-200">680+ FICO, $3K saved, <span className="text-green-400 font-semibold">approved for first home</span></span>
                </li>
                <li className="flex gap-4">
                  <span className="text-pink-400 font-bold text-sm whitespace-nowrap pt-0.5">Age 22–30</span>
                  <span className="text-gray-200">Building equity in owned property</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-pink-700/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total equity at 30</span>
                  <span className="text-green-400 font-black text-lg">$60,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Net worth impact</span>
                  <span className="text-green-400 font-black text-lg">Positive from day one</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent mb-2">
                15M+
              </div>
              <p className="text-gray-600 text-lg">Adults under 35 still living in their childhood home</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent mb-2">
                $240K
              </div>
              <p className="text-gray-600 text-lg">Average lifetime rent paid to build someone else's wealth</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent mb-2">
                44M
              </div>
              <p className="text-gray-600 text-lg">Americans trapped in the rent cycle forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-4">The Old Playbook is Dead</h2>
            <p className="text-gray-400 text-xl">AI, higher ed collapse, and a housing market that rewards early movers. Everything changed. Here's the new roadmap.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-black text-white mb-3">AI Rewrote Every Job</h3>
              <p className="text-gray-400 leading-relaxed">
                The careers that $120K degrees unlocked? AI does them in seconds. The people winning now aren't the most credentialed — they're the ones who own assets and build wealth early.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-black text-white mb-3">Higher Ed is Broken</h3>
              <p className="text-gray-400 leading-relaxed">
                Student debt hit $1.7 trillion. A 4-year degree costs more than a down payment. The smartest move isn't a diploma — it's a 720 credit score at 22 and keys to your first home.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-black text-white mb-3">Ownership Compounds</h3>
              <p className="text-gray-400 leading-relaxed">
                Every year you rent, someone else builds equity on your payments. Every year you own, your net worth grows. Start at 22 instead of 32 and you're a decade ahead — for life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Problem</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              You're responsible. You make decent money. But the system keeps you stuck.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Credit for Rent</h3>
              <p className="text-gray-700 leading-relaxed">
                Living with family? Zero rent = zero credit building. Paying rent to a landlord? Still doesn't count toward your score.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">The Credit Score Gap</h3>
              <p className="text-gray-700 leading-relaxed">
                Credit Karma shows 740. Mortgage lender sees FICO 680. The 30-60 point gap keeps you renting forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How Mimosa Works</h2>
            <p className="text-xl text-gray-700">
              Three steps from the childhood bedroom to owning your castle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Build Credit</h3>
              <p className="text-gray-600">
                Connect your bank once. Every rent payment reports to all 3 bureaus and builds your score. Years of rent history that should have been working for you? Now they do.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Level Up</h3>
              <p className="text-gray-600">
                Your credit score is your game level. Daily missions, streaks, and AI coaching unlock the next tier. Watch your score climb like a leaderboard — because now it is one.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Buy a House</h3>
              <p className="text-gray-600">
                Hit 720. Unlock our lender network. Get pre-approved in days, not months. Close on your first home — and never touch dad's credit card for rent money again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Preview */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                It's Duolingo for Credit Scores
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Your credit score becomes your game level. Daily missions keep you motivated. Achievements reward your progress.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Daily Missions</h4>
                    <p className="text-gray-600">Pay rent on time? +50 XP. Dispute an error? +20 XP.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-rose-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Track Progress</h4>
                    <p className="text-gray-600">See exactly how many points until you hit 720 for pre-approval.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">AI Coach</h4>
                    <p className="text-gray-600">Get personalized guidance on what to do next.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl p-6 mb-6">
                <p className="text-sm opacity-90 mb-2">Your Level</p>
                <div className="text-6xl font-bold mb-2">14</div>
                <p className="text-xl font-semibold">680 Credit Score</p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress to 720</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-3 rounded-full" style={{width: '65%'}}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">40 points to pre-approval</p>
              </div>

              <div className="space-y-3">
                <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Pay Rent On Time</p>
                      <p className="text-sm text-gray-600">Due in 12 days</p>
                    </div>
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">+50 XP</span>
                  </div>
                </div>

                <div className="bg-rose-50 border-l-4 border-rose-400 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Dispute Late Payment</p>
                      <p className="text-sm text-gray-600">Error found on report</p>
                    </div>
                    <span className="bg-rose-400 text-white px-3 py-1 rounded-full text-sm font-bold">+20 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Mimosa */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Mimosa Wins</h2>
            <p className="text-xl text-gray-700">
              We're the only platform gamifying credit for future homeowners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8">
              <Home className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automatic Rent Reporting</h3>
              <p className="text-gray-700">
                Connect your bank once. We verify payments and report to all 3 bureaus via Pinwheel API.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8">
              <Award className="w-12 h-12 text-rose-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gamified Experience</h3>
              <p className="text-gray-700">
                Credit score = game level. Daily missions, achievements, and AI coaching keep you motivated.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8">
              <Users className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Ecosystem</h3>
              <p className="text-gray-700">
                Future Homeowners, landlords, investors, and lenders. Network effects create a defensible moat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Castle?
          </h2>
          <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">
            Join the waitlist for early access in Baltimore and Washington DC. Launching Q2 2025.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-pink-600 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            Get Started Free
          </Link>
          <p className="text-pink-100 mt-6 text-sm">Free for first 100 users</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/mimosa-logo.svg" alt="Mimosa" width={32} height={32} className="h-8 w-auto" />
                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">Mimosa</span>
              </div>
              <p className="text-gray-400 text-sm">
                Stop renting forever. Build credit. Own your home.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/properties" className="hover:text-white transition">Browse Properties</Link></li>
                <li><Link href="/mimosa/about" className="hover:text-white transition">About</Link></li>
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
              <p className="text-gray-400 text-sm mb-2">
                <a href="https://Meatloaf.Rent" className="hover:text-white transition">Meatloaf.Rent</a>
              </p>
              <p className="text-gray-400 text-sm mb-2">
                <a href="mailto:RMetzgar@REMVentures.Tech" className="hover:text-white transition">RMetzgar@REMVentures.Tech</a>
              </p>
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
