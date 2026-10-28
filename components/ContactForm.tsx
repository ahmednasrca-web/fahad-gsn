'use client'

import { useState, useId } from 'react'
import type { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import { Button, Alert, Spinner } from '@heroui/react'

interface Props {
  locale: Locale
  workSlug?: string
}

const inputCls = 'w-full rounded-none border border-[#ecebe9] dark:border-[#211f1c] bg-white dark:bg-[#181614] px-4 py-3.5 text-sm text-[#11100e] dark:text-[#f6f5f4] outline-none transition-colors focus:border-black dark:focus:border-[#d47f31] placeholder:text-[#a0988d]'
const labelCls = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-[#615b51] dark:text-[#dad7d2]'

export default function ContactForm({ locale, workSlug }: Props) {
  const formId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (honeypot) return

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
        setName(''); setEmail(''); setPhone(''); setMessage('')
      } else {
        const data = await res.json().catch(() => ({}) as Record<string, string>) as Record<string, string>
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
      <Alert.Root status="success" role="status">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t(locale, 'messageSent')}</Alert.Title>
        </Alert.Content>
      </Alert.Root>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — hidden from humans */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${formId}-hp`}>Leave empty</label>
        <input id={`${formId}-hp`} type="text" value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={`${formId}-name`} className={labelCls}>
          {t(locale, 'yourName')} <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input id={`${formId}-name`} type="text" required autoComplete="name"
          value={name} onChange={(e) => setName(e.target.value)}
          className={inputCls} aria-required="true" />
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className={labelCls}>{t(locale, 'yourEmail')}</label>
        <input id={`${formId}-email`} type="email" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </div>

      <div>
        <label htmlFor={`${formId}-phone`} className={labelCls}>{t(locale, 'yourPhone')}</label>
        <input id={`${formId}-phone`} type="tel" autoComplete="tel"
          value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={labelCls}>
          {t(locale, 'yourMessage')} <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea id={`${formId}-message`} required rows={5}
          value={message} onChange={(e) => setMessage(e.target.value)}
          className={`${inputCls} resize-none`} aria-required="true" />
      </div>

      {error && (
        <Alert.Root status="danger" role="alert">
          <Alert.Indicator />
          <Alert.Content><Alert.Title>{error}</Alert.Title></Alert.Content>
        </Alert.Root>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="btn-furnish-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            {locale === 'ar' ? 'جارٍ الإرسال…' : 'Sending…'}
          </span>
        ) : t(locale, 'sendMessage')}
      </button>
    </form>
  )
}

