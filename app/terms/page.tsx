import { pageMetadata } from '@/lib/seo'
import SiteFooter from '@/COMPONENTS/SiteFooter'
import SiteNav from '@/COMPONENTS/SiteNav'
import ThemeBg from '@/COMPONENTS/ThemeBg'
import { CONTACT_EMAIL } from '@/lib/site'

export const generateMetadata = () =>
  pageMetadata({ title: 'Terms of Service', path: '/terms', describe: (brand) => `The terms for using ${brand}, an educational credit game and starter-home search. No credit pulls and no bureau reporting.` })

export default function TermsPage() {
  return (
    <ThemeBg className="min-h-screen">
      {/* Navigation */}
      <SiteNav />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-blue-200 text-lg">Last updated: October 6, 2026</p>
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
                Meatloaf is an educational and home-search platform operated by REMVentures LLC. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free credit and homebuying education, including a credit game that uses simulated practice scores</li>
                <li>Home and property listings provided by public sources and third-party agents</li>
                <li>Connections to a listing agent, only when you ask</li>
              </ul>
              <p className="mt-4">
                We are not a credit repair organization, credit bureau, lender, mortgage broker, or real estate brokerage, and we do not report information to any credit reporting agency.
              </p>
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
                <li>We do not report any information to credit bureaus. Scores in the credit game are simulated practice scores, not your real credit score.</li>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. No Credit Reporting</h2>
              <p>
                We do not report information to any credit bureau or credit reporting agency, and we do not pull, check, or change your credit. The credit game uses simulated scores for education only. We make no guarantee of credit score changes, loan approval, or home purchase.
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
                <li>Your credit score will change, or you will be approved for a loan or buy a home, as a result of using our platform</li>
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
              <div className="mt-4 bg-white/85 ring-1 ring-black/5 rounded-xl p-6">
                <p className="font-semibold text-gray-900">REMVentures LLC</p>
                <p className="text-gray-600">Operating as Meatloaf.Rent</p>
                <p className="text-gray-600">Baltimore, MD</p>
                <p className="mt-2"><a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 hover:underline">{CONTACT_EMAIL}</a></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter />
    </ThemeBg>
  )
}
