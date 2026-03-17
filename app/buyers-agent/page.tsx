'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import {
  Send, Loader2, Home, DollarSign, Calendar, BedDouble,
  Bath, Building2, ChevronRight, LogOut, Sparkles, ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface PropertyContext {
  address: string
  listPrice: string
  daysOnMarket: string
  bedrooms: string
  bathrooms: string
  yearBuilt: string
  propertyType: string
  hoa: string
}

const SUGGESTED_PROMPTS = [
  'Analyze this listing and tell me if it\'s a good deal',
  'What should I offer on this property?',
  'What should I negotiate beyond price?',
  'What red flags should I look for?',
  'What will my true monthly cost be?',
  'How much am I saving by not using an agent?',
]

const PROPERTY_TYPES = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Land',
  'Other',
]

export default function BuyersAgentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [buyerName, setBuyerName] = useState('')
  const [buyerBudget, setBuyerBudget] = useState('')

  const [property, setProperty] = useState<PropertyContext>({
    address: '',
    listPrice: '',
    daysOnMarket: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    propertyType: 'Single Family',
    hoa: '',
  })
  const [pendingProperty, setPendingProperty] = useState<PropertyContext>({
    address: '',
    listPrice: '',
    daysOnMarket: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    propertyType: 'Single Family',
    hoa: '',
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Buyers Agent. I'll help you save money, negotiate smart, and avoid costly mistakes — at zero cost to you.\n\nFill in the property details on the left, then ask me anything. I can analyze the listing, recommend an offer price, flag red flags, and help you negotiate like a pro.",
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, credit_score')
        .eq('id', user.id)
        .single()
      if (profile?.full_name) setBuyerName(profile.full_name)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const agentFee = property.listPrice
    ? Math.round(Number(property.listPrice) * 0.025)
    : null

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || sending) return

    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setSending(true)

    try {
      const res = await fetch('/api/buyers-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          propertyContext: property,
          buyerContext: { name: buyerName, budget: buyerBudget },
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      toast.error('Failed to get a response. Please try again.')
      setMessages((prev) => prev.slice(0, -1))
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const applyProperty = () => {
    setProperty({ ...pendingProperty })
    toast.success('Property details updated')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition text-sm">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="h-5 w-px bg-gray-200" />
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="Meatloaf" width={32} height={32} className="h-8 w-auto" />
                <span className="text-xl font-bold text-gray-900 hidden sm:inline">Meatloaf</span>
              </Link>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                AI Buyers Agent
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Savings banner */}
      {agentFee !== null && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 text-center text-sm font-semibold">
          Traditional buyer&apos;s agent fee on {property.listPrice ? `$${Number(property.listPrice).toLocaleString()}` : 'this home'}: ~${agentFee.toLocaleString()} &nbsp;·&nbsp; Your cost: $0 &nbsp;·&nbsp;
          <span className="underline underline-offset-2">You save: ~${agentFee.toLocaleString()}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">

        {/* Left panel — property details */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Property Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Address</label>
                <input
                  type="text"
                  placeholder="123 Main St, City, ST"
                  value={pendingProperty.address}
                  onChange={(e) => setPendingProperty((p) => ({ ...p, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    <DollarSign className="w-3 h-3 inline" /> List Price
                  </label>
                  <input
                    type="number"
                    placeholder="400000"
                    value={pendingProperty.listPrice}
                    onChange={(e) => setPendingProperty((p) => ({ ...p, listPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    <Calendar className="w-3 h-3 inline" /> Days on Market
                  </label>
                  <input
                    type="number"
                    placeholder="21"
                    value={pendingProperty.daysOnMarket}
                    onChange={(e) => setPendingProperty((p) => ({ ...p, daysOnMarket: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    <BedDouble className="w-3 h-3 inline" /> Beds
                  </label>
                  <input
                    type="number"
                    placeholder="3"
                    value={pendingProperty.bedrooms}
                    onChange={(e) => setPendingProperty((p) => ({ ...p, bedrooms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    <Bath className="w-3 h-3 inline" /> Baths
                  </label>
                  <input
                    type="number"
                    placeholder="2"
                    value={pendingProperty.bathrooms}
                    onChange={(e) => setPendingProperty((p) => ({ ...p, bathrooms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Year Built</label>
                  <input
                    type="number"
                    placeholder="1998"
                    value={pendingProperty.yearBuilt}
                    onChange={(e) => setPendingProperty((p) => ({ ...p, yearBuilt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">HOA ($/mo)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={pendingProperty.hoa}
                    onChange={(e) => setPendingProperty((p) => ({ ...p, hoa: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Property Type</label>
                <select
                  value={pendingProperty.propertyType}
                  onChange={(e) => setPendingProperty((p) => ({ ...p, propertyType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={applyProperty}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Update Property
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-900 text-base mb-3">Quick Questions</h2>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={sending}
                  className="w-full text-left text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Buyers Agent</h3>
              <p className="text-blue-100 text-xs">Saving you thousands — powered by Claude AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about offer price, negotiation, red flags..."
                disabled={sending}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || sending}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Enter to send · Shift+Enter for new line · Powered by Claude AI
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
