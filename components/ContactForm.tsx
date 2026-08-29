'use client'

import { useState, useId } from 'react'
import type { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'

interface Props {
  locale: Locale
  workSlug?: string
}

export default function ContactForm({ locale, workSlug }: Props) {
  const formId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('') // anti-spam
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (honeypot) return // bot caught

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, workSlug, honeypot }),
      })

      if (res.ok) {
        setSuccess(true)
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? t(locale, 'messageError'))
      }
    } catch {
      setError(t(locale, 'messageError'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
      >
        <p className="text-4xl" aria-hidden="true">✓</p>
        <p className="mt-4 font-semibold text-green-800">
          {t(locale, 'messageSent')}
        </p>
      </div>
    )
  }

  const inputClass = "w-full rounded-xl border border-[#E8DDD0] bg-white px-4 py-3 text-[15px] text-[#1A1209] outline-none transition focus:border-[#2C1810] focus:ring-2 focus:ring-[#2C1810]/10 placeholder:text-[#A09080]"
  const labelClass = "mb-1.5 block text-sm font-medium text-[#1A1209]"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from humans, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${formId}-hp`}>Leave empty</label>
        <input
          id={`${formId}-hp`}
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor={`${formId}-name`} className={labelClass}>
          {t(locale, 'yourName')} <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          aria-required="true"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`${formId}-email`} className={labelClass}>
          {t(locale, 'yourEmail')}
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor={`${formId}-phone`} className={labelClass}>
          {t(locale, 'yourPhone')}
        </label>
        <input
          id={`${formId}-phone`}
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`${formId}-message`} className={labelClass}>
          {t(locale, 'yourMessage')} <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-none`}
          aria-required="true"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-[52px] items-center justify-center rounded-2xl bg-[#2C1810] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 active:opacity-75"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {locale === 'ar' ? 'جارٍ الإرسال…' : 'Sending…'}
          </span>
        ) : (
          t(locale, 'sendMessage')
        )}
      </button>
    </form>
  )
}
