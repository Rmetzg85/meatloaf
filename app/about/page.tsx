'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
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
              <Link href="/mimosa" className="text-pink-500 hover:text-pink-700 font-medium text-sm border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-50 transition">
                Switch to Mimosa →
              </Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="py-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight text-white">
            I Graduated in 2008.<br />You Know What Happened Next.
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
            This is my story. And the story of millions of millennials who were sold a lie.
          </p>
        </div>
      </section>

      {/* Main story */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* The Story */}
          <div className="mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">The Story</p>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Like millions of other millennials, I was told that regardless of the degree, college was a necessary prerequisite to live a successful life.
              </p>
              <p>
                FAFSA nights were treated like senior milestones — more important than teaching about wealth, ownership, or financial literacy. Student loans were handed out like candy on Halloween. Meanwhile, the higher education industrial complex was pushing graduates right back to their parents' basements.
              </p>
              <p>
                I graduated in 2008. If you remember that year, you know what I'm talking about. The housing market collapsed. The economy tanked. Jobs disappeared. And millions of us — degree in hand, debt on our backs — moved home.
              </p>
              <p>
                Next thing you know, millennials in their mid-20s and 30s were screaming "MA! THE MEATLOAF!" like Will Ferrell in <em>Wedding Crashers</em>. Except it wasn't funny. It was our reality.
              </p>
            </div>
          </div>

          {/* The Realization */}
          <div className="mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">The Realization</p>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Here's what keeps me up at night: If I could go back to 2008 with $50,000, would I choose a college degree or a down payment on a starter home?
              </p>
            </div>

            {/* Pull quote */}
            <blockquote className="my-10 border-l-4 border-blue-600 pl-6">
              <p className="text-2xl font-bold text-gray-900 leading-snug">
                "The degree got me credentials and debt.<br />A home would've given me equity and wealth."
              </p>
            </blockquote>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                By age 30, that $50,000 home investment would be worth $150,000+. Instead, I spent a decade paying off loans for a piece of paper that depreciated the moment I walked across that stage.
              </p>
              <p>
                I'm not alone.
              </p>
            </div>

            {/* Stat callout */}
            <div className="my-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">72 million</p>
              <p className="text-xl font-semibold text-gray-900">Americans under 40 are living this same story right now.</p>
            </div>
          </div>

          {/* The Mission */}
          <div className="mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">The Mission</p>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p className="text-2xl font-bold text-gray-900">That's why I built Meatloaf.</p>
              <p>
                We're not just helping people move out. We're changing <em>when</em> financial literacy begins in America.
              </p>
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p className="text-gray-500 line-through">Not at 25 when you're denied for an apartment.</p>
                <p className="text-gray-500 line-through">Not at 22 when you graduate with debt.</p>
                <p className="text-gray-900 font-bold text-xl">At 16 with your first job.</p>
              </div>
              <p>
                Two years of credit history by age 18. A 680 FICO score by 22. Keys to your own place — not a diploma with debt — by 25.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote className="my-10 bg-gray-900 text-white rounded-2xl p-8">
              <p className="text-2xl font-black leading-snug mb-0">
                "Homeownership is the new college degree."
              </p>
              <p className="text-gray-400 mt-3 text-base">
                And we're building the platform to make it accessible to everyone who was told the old path was the only path.
              </p>
            </blockquote>
          </div>

          {/* The Builder */}
          <div className="mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">The Builder</p>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                I'm Ryan Metzgar. I taught myself to code in 12 months using AI assistance. I built this entire platform solo while working full-time for the Maryland state government.
              </p>
              <p>
                I'm not a Silicon Valley founder with venture backing and a Stanford degree. I'm a millennial who lived in his parents' basement, paid off student loans, and decided to build the solution I wish existed when I was 22.
              </p>
              <p>
                Meatloaf isn't funded by VCs (yet). It's built by someone who knows what it feels like to be stuck, to be told you did everything right, and to realize the system was rigged against you from the start.
              </p>
            </div>
          </div>

          {/* The Invitation */}
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">The Invitation</p>
            <div className="space-y-3 text-gray-700 text-lg leading-relaxed mb-10">
              <p>If you're living at home and tired of feeling stuck, <strong className="text-gray-900">this is for you.</strong></p>
              <p>If you're paying rent and getting zero credit for it, <strong className="text-gray-900">this is for you.</strong></p>
              <p>If you're a parent watching your kid struggle with the same broken system you did, <strong className="text-gray-900">this is for you.</strong></p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 space-y-3 text-gray-700 text-lg leading-relaxed">
              <p>Let's build something different.</p>
              <p>Let's turn rent into credit.</p>
              <p>Let's turn credit into homes.</p>
              <p>Let's build wealth, not debt.</p>
              <p className="text-2xl font-black text-gray-900 pt-2">Join me.</p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to write a different story?
          </h2>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            Get Started Free
          </Link>
          <p className="text-blue-200 mt-6 text-sm">Launching Q1 2026 in Baltimore & Washington DC</p>
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
