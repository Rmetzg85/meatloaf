import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
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
              <Link href="/properties" className="text-gray-700 hover:text-gray-900 font-medium">Browse Properties</Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">About</Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: March 2026</p>
        <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2><p>Meatloaf collects your name, email, and account preferences when you create an account. We also collect financial data through our secure bank integration to verify and report rent payments to credit bureaus.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2><p>We use information to provide our services, report rent payments to Experian, TransUnion, and Equifax, provide AI-powered credit coaching, and connect you with our lender network at mortgage readiness.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">3. Information Sharing</h2><p>We do not sell your personal information. We share data only with credit bureaus for reporting, our verified lender network with your consent, and service providers that help operate the platform.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">4. Data Security</h2><p>We use industry-standard encryption to protect your data. All bank connections are handled via Pinwheel&apos;s secure API. We never store your banking credentials.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">5. Your Rights</h2><p>You may access, correct, or delete your personal information at any time by contacting us at RMetzgar@REMVentures.Tech.</p></section>
          <section><h2 className="text-2xl font-bold text-gray-900 mb-3">6. Contact Us</h2><p>Questions? Email <a href="mailto:RMetzgar@REMVentures.Tech" className="text-blue-600 hover:underline">RMetzgar@REMVentures.Tech</a></p></section>
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-8 mt-16"><div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm"><p>© 2026 REMVentures LLC. All rights reserved.</p><div className="flex justify-center space-x-6 mt-3"><Link href="/privacy" className="hover:text-white">Privacy Policy</Link><Link href="/terms" className="hover:text-white">Terms of Service</Link><Link href="/contact" className="hover:text-white">Contact</Link></div></div></footer>
    </div>
  )
}
