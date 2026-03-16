'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Scissors,
  Share2,
  Film,
  Users,
  DollarSign,
  Zap,
  ChevronRight,
  Play,
  Star,
  Menu,
  X,
  CheckCircle,
  Radio,
  TrendingUp,
  Shield,
} from 'lucide-react'

export default function OutspendPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (emailInput.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0a1628] border-b border-red-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/outspend" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded bg-red-600">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Out<span className="text-red-500">spend</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white text-sm font-medium transition">
                How It Works
              </a>
              <a href="#features" className="text-gray-300 hover:text-white text-sm font-medium transition">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white text-sm font-medium transition">
                Pricing
              </a>
              <a
                href="#waitlist"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition"
              >
                Join the Waitlist
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1628] border-t border-red-700/30 px-4 py-4 flex flex-col gap-4">
            <a href="#how-it-works" className="text-gray-300 hover:text-white py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </a>
            <a href="#features" className="text-gray-300 hover:text-white py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a
              href="#waitlist"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-bold text-sm text-center transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join the Waitlist
            </a>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        {/* Subtle star-field bg */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #dc2626 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Radio className="w-3 h-3 animate-pulse" />
            Built for Republican Campaigns · 2026 Ready
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Political Ads<br />
            <span className="text-red-500">Without the PAC Price Tag.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Clip, brand, and share powerful campaign ads in minutes — not months.
            Any candidate can take a winning ad, add their authority line, and
            push it to every platform for pennies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:-translate-y-0.5 shadow-lg shadow-red-900/40"
            >
              Get Early Access
            </a>
            <a
              href="#how-it-works"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg transition"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof line */}
          <p className="mt-8 text-gray-500 text-sm">
            Join <span className="text-white font-semibold">1,200+ candidates & campaign managers</span> on the waitlist
          </p>
        </div>
      </section>

      {/* ── The Problem ────────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            PACs Spend <span className="text-red-500">Millions</span>.<br />
            You Spend <span className="text-red-500">What You Have</span>.
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed mb-14">
            A professional 30-second political ad costs $15,000–$50,000 to produce.
            Super PACs spend nine figures per cycle. Down-ballot candidates get nothing.
            That imbalance ends now.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: '$14B', label: 'Spent on political ads in 2024' },
              { stat: '90%', label: 'Goes to PACs and top-of-ticket races' },
              { stat: '0', label: 'Days it should take to make a great ad' },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <div className="text-5xl font-black text-red-500 mb-3">{stat}</div>
                <p className="text-gray-400 text-lg">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              From Raw Footage to Shared Ad in{' '}
              <span className="text-red-600">Under 10 Minutes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No agency. No production budget. No waiting.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Film className="w-8 h-8 text-red-600" />,
                step: '01',
                title: 'Find or Upload',
                desc: 'Browse the shared ad library or upload your own footage — news clips, speeches, rallies, podcast hot takes, whatever you have.',
              },
              {
                icon: <Scissors className="w-8 h-8 text-red-600" />,
                step: '02',
                title: 'Clip & Edit',
                desc: 'Trim the clip, stack multiple moments together, add text overlays and music. Our editor is built for campaigns, not Hollywood.',
              },
              {
                icon: <Shield className="w-8 h-8 text-red-600" />,
                step: '03',
                title: 'Add Your Authority Line',
                desc: 'One click to stamp your "Paid for by [Campaign Name]" authority line. Stay compliant with FEC disclosure rules automatically.',
              },
              {
                icon: <Share2 className="w-8 h-8 text-red-600" />,
                step: '04',
                title: 'Publish Everywhere',
                desc: 'Push to X, Facebook, Instagram, TikTok, and YouTube simultaneously. Track impressions and engagement in real time.',
              },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="relative">
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-red-100 z-0 -translate-y-1/2" style={{ width: 'calc(100% - 4rem)' }} />
                <div className="relative z-10 bg-white border-2 border-gray-100 hover:border-red-200 rounded-2xl p-8 h-full transition group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition">
                      {icon}
                    </div>
                    <span className="text-4xl font-black text-gray-100 group-hover:text-red-100 transition">{step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Shared Ad Library ──────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                <Users className="w-3 h-3" />
                Shared Library
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                One Candidate's Win Is{' '}
                <span className="text-red-600">Every Candidate's Win.</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                When a congressional candidate creates a killer ad hammering bad Democratic policy,
                every other Republican candidate in the country can grab it, drop in their own
                authority line, and run it in their district — for free.
              </p>
              <ul className="space-y-4">
                {[
                  'Generalized party-attack ads reusable by any candidate',
                  'Local versions auto-adapted to your district',
                  'Creator gets credit & visibility on the platform',
                  'Viral reach without viral budgets',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock ad card UI */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="bg-[#0a1628] text-white px-6 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-300 font-mono">outspend.io / library</span>
              </div>

              <div className="p-6 space-y-4">
                {[
                  {
                    title: '"Inflation Under Democrats" — 0:28',
                    uses: '847 campaigns used this',
                    tag: 'National',
                  },
                  {
                    title: '"Open Border Crisis" — 0:45',
                    uses: '1,204 campaigns used this',
                    tag: 'National',
                  },
                  {
                    title: '"[Name] Said WHAT?" Clip Pack',
                    uses: '312 campaigns used this',
                    tag: 'Viral',
                  },
                ].map(({ title, uses, tag }) => (
                  <div
                    key={title}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0 transition">
                      <Play className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{uses}</p>
                    </div>
                    <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">{tag}</span>
                  </div>
                ))}

                <button className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
                  Use This Ad <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Everything a Campaign Needs.{' '}
              <span className="text-red-600">Nothing It Doesn't.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Scissors className="w-7 h-7 text-red-600" />,
                title: 'Clip Builder',
                desc: 'Snip viral moments from podcasts, news, hearings, or speeches. Chain clips together with transitions and captions for maximum impact.',
              },
              {
                icon: <Shield className="w-7 h-7 text-red-600" />,
                title: 'Auto Authority Line',
                desc: 'FEC-compliant "Paid for by" disclaimers generated and burned into every ad you publish. Never worry about compliance again.',
              },
              {
                icon: <Share2 className="w-7 h-7 text-red-600" />,
                title: 'One-Click Multi-Platform Push',
                desc: 'Publish simultaneously to X, Facebook, Instagram, TikTok, and YouTube with platform-optimized aspect ratios handled automatically.',
              },
              {
                icon: <Users className="w-7 h-7 text-red-600" />,
                title: 'Shared Ad Library',
                desc: 'Hundreds of ready-to-use generalized attack ads. Any candidate can remix, rebrand, and redeploy in their district instantly.',
              },
              {
                icon: <TrendingUp className="w-7 h-7 text-red-600" />,
                title: 'Real-Time Analytics',
                desc: 'Track views, shares, and engagement across every platform from a single dashboard. Know what's working before you spend more.',
              },
              {
                icon: <Zap className="w-7 h-7 text-red-600" />,
                title: 'Rapid Response',
                desc: 'Opponent says something damaging at 9pm? Have an ad live by 9:15pm. Outspend is built for speed, not bureaucracy.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-2xl p-8 transition group">
                <div className="w-14 h-14 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center mb-5 transition">
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Case Scenarios ─────────────────────────────────────────── */}
      <section className="py-24 bg-[#0a1628] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Real Scenarios. Real Results.
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Here's how campaigns are using Outspend to punch above their weight class.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                scenario: 'The Podcast Clip',
                color: 'border-red-500',
                accent: 'text-red-400',
                story:
                  'A Democrat senator makes a shocking statement on a national podcast. Within 10 minutes, 40 Republican House candidates have clipped it, added their authority line, and pushed it to every platform in their district.',
              },
              {
                scenario: 'The Shared Attack Ad',
                color: 'border-blue-500',
                accent: 'text-blue-400',
                story:
                  'A congressional candidate creates a 30-second ad on inflation. It hits the shared library. 500 state-level candidates download it, add their name, and run it locally — amplifying the message nationwide for zero extra production cost.',
              },
              {
                scenario: 'The Rapid Response',
                color: 'border-yellow-500',
                accent: 'text-yellow-400',
                story:
                  'An opponent stumbles in a debate. A campaign manager clips the moment, stacks it with three prior stumbles, adds a title card, and has the ad live on all platforms before the post-debate news cycle ends.',
              },
            ].map(({ scenario, color, accent, story }) => (
              <div key={scenario} className={`bg-gray-900 border-t-4 ${color} rounded-2xl p-8`}>
                <div className={`text-xs font-bold uppercase tracking-widest ${accent} mb-4`}>
                  Scenario
                </div>
                <h3 className="text-2xl font-black mb-4">{scenario}</h3>
                <p className="text-gray-400 leading-relaxed">{story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Fraction of a PAC Budget.
              <br />
              <span className="text-red-600">All of the Impact.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {[
              {
                tier: 'Grassroots',
                price: '$49',
                period: '/mo',
                highlight: false,
                desc: 'Perfect for state legislature and local races.',
                features: [
                  '5 ad exports per month',
                  'Shared library access',
                  'Authority line generator',
                  '2 social platforms',
                  'Basic analytics',
                ],
              },
              {
                tier: 'Campaign',
                price: '$199',
                period: '/mo',
                highlight: true,
                desc: 'Built for congressional and statewide races.',
                features: [
                  'Unlimited ad exports',
                  'Full shared library + upload',
                  'FEC compliance auto-check',
                  'All 5 platforms',
                  'Advanced analytics dashboard',
                  'Rapid response toolkit',
                  'Priority support',
                ],
              },
              {
                tier: 'War Room',
                price: '$599',
                period: '/mo',
                highlight: false,
                desc: 'For party committees and multi-candidate ops.',
                features: [
                  'Everything in Campaign',
                  'Unlimited team seats',
                  'White-label exports',
                  'Bulk library management',
                  'API access',
                  'Dedicated account manager',
                ],
              },
            ].map(({ tier, price, period, highlight, desc, features }) => (
              <div
                key={tier}
                className={`rounded-2xl p-8 flex flex-col ${
                  highlight
                    ? 'bg-red-600 text-white shadow-2xl shadow-red-900/30 scale-105'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                }`}
              >
                {highlight && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                    <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">Most Popular</span>
                  </div>
                )}
                <h3 className={`text-xl font-black mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{tier}</h3>
                <p className={`text-sm mb-4 ${highlight ? 'text-red-200' : 'text-gray-500'}`}>{desc}</p>
                <div className={`text-5xl font-black mb-6 ${highlight ? 'text-white' : 'text-gray-900'}`}>
                  {price}
                  <span className={`text-xl font-medium ${highlight ? 'text-red-200' : 'text-gray-400'}`}>{period}</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlight ? 'text-red-200' : 'text-red-600'}`} />
                      <span className={`text-sm ${highlight ? 'text-red-100' : 'text-gray-700'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#waitlist"
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition ${
                    highlight
                      ? 'bg-white text-red-600 hover:bg-red-50'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  Get Early Access
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* ── Waitlist CTA ───────────────────────────────────────────────── */}
      <section id="waitlist" className="bg-[#0a1628] text-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <Radio className="w-3 h-3 animate-pulse" />
            Launching Q3 2026
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Get In Before Your Opponent Does.
          </h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed">
            Early access members lock in founding pricing and get first access to the ad library.
            Join the waitlist — it takes 10 seconds.
          </p>

          {submitted ? (
            <div className="bg-green-600/20 border border-green-500/40 text-green-400 rounded-2xl px-8 py-6 text-lg font-bold">
              You're on the list. We'll be in touch before launch.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@campaign.com"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 px-5 py-4 rounded-xl focus:outline-none focus:border-red-500 transition"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-base transition whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          )}

          <p className="text-gray-600 text-sm mt-6">
            No spam. No fundraising asks. Just early access info.
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-red-600">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-black">
              Out<span className="text-red-500">spend</span>
            </span>
          </div>
          <p className="text-sm text-center">
            © 2026 Outspend. All rights reserved. Political advertising technology platform.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/outspend/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/outspend/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/outspend/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
