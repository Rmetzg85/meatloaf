import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
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
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/properties" className="text-gray-700 hover:text-gray-900 font-medium">Browse Properties</Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">About</Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-blue-200 text-lg">Last updated: March 25, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
          <div className="space-y-10 text-gray-700 leading-relaxed">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                REMVentures LLC ("we," "us," or "our") operates Meatloaf.Rent (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using our Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Name and email address (collected at signup)</li>
                <li>Account credentials (passwords are hashed and never stored in plain text)</li>
                <li>User type (future homeowner, landlord, lender, or real estate agent)</li>
                <li>Credit score data (self-reported or connected via third-party integrations)</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Property & Rental Information</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Property addresses and listing details submitted by landlords</li>
                <li>Rental applications submitted by renters</li>
                <li>Payment history and rent reporting data (when connected)</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Usage Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pages visited, features used, and time spent on the platform</li>
                <li>Device type, browser, and IP address</li>
                <li>Gamification activity (XP earned, missions completed, streaks)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, operate, and improve our Service</li>
                <li>To match renters with available properties</li>
                <li>To report on-time rent payments to credit bureaus (with your explicit consent)</li>
                <li>To send transactional emails (account confirmation, application updates)</li>
                <li>To personalize your dashboard experience and track homeownership progress</li>
                <li>To communicate product updates and company news (you may opt out at any time)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing Your Information</h2>
              <p className="mb-4">We do not sell your personal information. We may share your data only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>With landlords:</strong> Your rental application information is shared with landlords you apply to.</li>
                <li><strong>With credit bureaus:</strong> Rent payment data is reported to credit bureaus only with your explicit, written consent.</li>
                <li><strong>With service providers:</strong> We use Supabase for database and authentication services. These providers are contractually bound to protect your data.</li>
                <li><strong>For legal compliance:</strong> We may disclose data if required by law or to protect our legal rights.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p>
                We implement industry-standard security measures including encrypted data transmission (HTTPS), hashed password storage, and access controls. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Withdraw consent for credit reporting at any time</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at <a href="mailto:RMetzgar@REMVentures.Tech" className="text-blue-600 hover:underline">RMetzgar@REMVentures.Tech</a>.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
              <p>
                We use session cookies to keep you logged in and preference cookies to remember your settings. We do not use third-party advertising cookies. You may disable cookies in your browser settings, though some features of the Service may not function correctly without them.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p>
                Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant changes by email or by a prominent notice on our website. Your continued use of the Service after changes take effect constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <div className="mt-4 bg-gray-50 rounded-xl p-6">
                <p className="font-semibold text-gray-900">REMVentures LLC</p>
                <p className="text-gray-600">Operating as Meatloaf.Rent</p>
                <p className="text-gray-600">Baltimore, MD</p>
                <p className="mt-2"><a href="mailto:RMetzgar@REMVentures.Tech" className="text-blue-600 hover:underline">RMetzgar@REMVentures.Tech</a></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/privacy" className="text-white hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          © 2026 REMVentures LLC. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
