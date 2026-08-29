'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import Logo from '@/components/brand/Logo'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.replace(from)
      } else {
        const data = await res.json().catch(() => ({}) as Record<string, string>)
        setError((data as Record<string, string>).error ?? 'بيانات الدخول غير صحيحة')
      }
    } catch {
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#FAF7F2] px-5">
      <div className="w-full max-w-sm">
        {/* Official Logo / Brand */}
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <Logo variant="stacked" locale="ar" showSubtitle={true} href="" />
          <p className="mt-2 text-xs font-semibold text-[#8A7968]">لوحة التحكم الإدارية</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[#1A1209]"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#E8DDD0] bg-white px-4 py-3 text-[15px] text-[#1A1209] outline-none transition focus:border-[#2C1810] focus:ring-2 focus:ring-[#2C1810]/10"
              placeholder="admin@fahadgsn.com"
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-[#1A1209]"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E8DDD0] bg-white px-4 py-3 text-[15px] text-[#1A1209] outline-none transition focus:border-[#2C1810] focus:ring-2 focus:ring-[#2C1810]/10"
              placeholder="••••••••"
              aria-invalid={error ? 'true' : undefined}
            />
          </div>

          {error && (
            <p
              id="login-error"
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex min-h-[52px] items-center justify-center rounded-2xl bg-[#2C1810] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 active:opacity-75"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                جارٍ التحقق…
              </span>
            ) : (
              'دخول'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh items-center justify-center bg-[#FAF7F2]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C1810] border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
