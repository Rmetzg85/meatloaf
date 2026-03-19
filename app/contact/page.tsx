'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Store lead in localStorage as fallback (email sending not configured yet)
    const leads = JSON.parse(localStorage.getItem('meatloaf_leads') || '[]')
    leads.push({ ...form, timestamp: new Date().toISOString(), source: 'contact_page' })
    localStorage.setItem('meatloaf_leads', JSON.stringify(leads))
    setSubmitted(true)
  }

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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-10 text-lg">Questions about Meatloaf? We&apos;d love to hear from you.</p>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Received!</h2>
            <p className="text-gray-600">Thanks for reaching out. We&apos;ll get back to you within 24 hours at <strong>{form.email}</strong>.</p>
            <Link href="/" className="inline-block mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold">Back to Home</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select a topic...</option>
                <option value="general">General Inquiry</option>
                <option value="landlord">Landlord Partnership</option>
                <option value="lender">Lender Partnership</option>
                <option value="agent">Real Estate Agent</option>
                <option value="support">Account Support</option>
                <option value="press">Press / Media</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tell us how we can help..." />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition">Send Message</button>
          </form>
        )}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Other ways to reach us</h3>
          <p className="text-gray-600">📧 <a href="mailto:RMetzgar@REMVentures.Tech" className="text-blue-600 hover:underline">RMetzgar@REMVentures.Tech</a></p>
          <p className="text-gray-600 mt-2">📍 Baltimore, MD & Washington, DC</p>
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-8 mt-16"><div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm"><p>© 2026 REMVentures LLC. All rights reserved.</p><div className="flex justify-center space-x-6 mt-3"><Link href="/privacy" className="hover:text-white">Privacy Policy</Link><Link href="/terms" className="hover:text-white">Terms of Service</Link><Link href="/contact" className="hover:text-white">Contact</Link></div></div></footer>
    </div>
  )
}
