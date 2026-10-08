'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authErrorMessage, resendConfirmation } from '@/lib/auth'

// Resends the signup confirmation email, with a short cooldown between sends.
export default function ResendConfirmButton({ email, className = '', label = 'Resend confirmation email' }: { email: string; className?: string; label?: string }) {
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const resend = async () => {
    if (!email) { toast.error('Enter your email address first'); return }
    setSending(true)
    const { error } = await resendConfirmation(email)
    setSending(false)
    if (error) {
      toast.error(authErrorMessage(error, 'Could not resend the email'))
      return
    }
    toast.success(`Confirmation email sent to ${email}`)
    setCooldown(60)
  }

  return (
    <button type="button" onClick={resend} disabled={sending || cooldown > 0} className={`inline-flex items-center justify-center disabled:opacity-60 ${className}`}>
      {sending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />Sending...</> : cooldown > 0 ? `Sent. Resend again in ${cooldown}s` : label}
    </button>
  )
}
