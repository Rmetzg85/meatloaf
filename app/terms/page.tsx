import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Meatloaf" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold text-gray-900">Meatloaf</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/properties" className="text-gray-700 font-medium">Browse Properties</Link>
              <Link href="/about" className="text-gray-700 font-medium">About</Link>
              <Link href="/auth/login" className="text-gray-700 font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: March 2026</p>
        <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2><p>By accessing or using Meatloaf, you agree to be bound by these Terms of Service and our Privacy Policy.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">2. Description of Service</h2><p>Meatloaf is a credit-building platform that helps renters report rent payments to major credit bureaus, track credit progress, and prepare for homeownership.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">3. Eligibility</h2><p>You must be at least 18 years old to use Meatloaf. By creating an account, you represent that you meet this requirement.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">4. Account Responsibilities</h2><p>You are responsible for maintaining the confidentiality of your account and for all activity that occurs under your account.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">5. Credit Bureau Reporting</h2><p>By connecting your bank account and enabling rent reporting, you authorize Meatloaf to verify and report your rent payments to Experian, TransUnion, and Equifax.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2><p>Meatloaf is not a credit repair service and does not guarantee specific credit score outcomes. Results vary based on individual credit history.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">7. Contact</h2><p>Questions? Email <a href="mailto:RMetzgar@REMVentures.Tech" className="text-blue-600 hover:underline">RMetzgar@REMVentures.Tech</a></p></section>
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-8 mt-16"><div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm"><p>© 2026 REMVentures LLC. All rights reserved.</p><div className="flex justify-center space-x-6 mt-3"><Link href="/privacy" className="hover:text-white">Privacy Policy</Link><Link href="/terms" className="hover:text-white">Terms of Service</Link><Link href="/contact" className="hover:text-white">Contact</Link></div></div></footer>
    </div>
  )
}
