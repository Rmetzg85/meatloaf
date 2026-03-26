import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
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
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-blue-200 text-lg">Last updated: March 25, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-gray-700 leading-relaxed">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using Meatloaf.Rent (the "Service") operated by REMVentures LLC ("Company," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="mb-4">
                Meatloaf is a housing and financial empowerment platform that connects renters, landlords, lenders, and real estate agents. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A rental property marketplace connecting renters and landlords</li>
                <li>Credit-building tools through on-time rent payment reporting</li>
                <li>Gamified financial literacy and homeownership coaching</li>
                <li>AI-powered property search and buyers agent tools</li>
                <li>Connections to mortgage lenders and real estate professionals</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="mb-4">To use certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                <li>Promptly notify us of any unauthorized use of your account</li>
                <li>Take responsibility for all activity that occurs under your account</li>
              </ul>
              <p className="mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms or are used for fraudulent purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Types and Responsibilities</h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Future Homeowners / Renters</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>You agree to provide truthful information on rental applications</li>
                <li>Credit reporting is opt-in; you may withdraw consent at any time</li>
                <li>Gamification rewards (XP, milestones) are for motivational purposes only and do not constitute financial advice</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Landlords</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>You are responsible for the accuracy of all property listings</li>
                <li>You must comply with all applicable federal, state, and local fair housing laws</li>
                <li>You may not discriminate against applicants based on race, color, national origin, religion, sex, familial status, or disability</li>
                <li>You are responsible for verifying tenant eligibility in accordance with applicable law</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Lenders & Real Estate Agents</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must hold all required licenses and certifications in your jurisdiction</li>
                <li>You are solely responsible for the advice and services you provide to users</li>
                <li>Your participation on the platform does not constitute an endorsement by REMVentures LLC</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Conduct</h2>
              <p className="mb-4">You may not use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Post false, misleading, or fraudulent property listings or applications</li>
                <li>Violate any fair housing or anti-discrimination laws</li>
                <li>Harass, threaten, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Scrape, crawl, or otherwise extract data from the platform without permission</li>
                <li>Use the platform for any unlawful purpose</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Credit Reporting</h2>
              <p>
                Rent payment reporting to credit bureaus is an opt-in feature. By enrolling, you authorize us to share your payment data with credit reporting agencies. You may revoke this authorization at any time by contacting us. We are not responsible for how credit bureaus process, score, or use reported data. Credit score improvements are not guaranteed.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimers</h2>
              <p className="mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Any property listing is accurate, available, or suitable for your needs</li>
                <li>Credit scores will improve as a result of using our platform</li>
                <li>AI-generated advice is accurate or appropriate for your specific situation</li>
              </ul>
              <p className="mt-4">
                Nothing on this platform constitutes legal, financial, or real estate advice. Always consult qualified professionals for decisions of material consequence.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, REMVentures LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of profits, data, or goodwill, even if we have been advised of the possibility of such damages. Our total liability to you for any claims arising from the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Service — including text, graphics, logos, and software — are owned by REMVentures LLC and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Maryland, without regard to its conflict of law provisions. Any disputes shall be resolved in the state or federal courts located in Baltimore, Maryland.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of material changes by email or by posting the updated Terms on this page with a new effective date. Your continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p>For questions about these Terms, contact us:</p>
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
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="text-white hover:text-gray-300">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          © 2026 REMVentures LLC. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
