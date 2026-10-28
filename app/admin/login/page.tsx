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
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#f6f5f4] dark:bg-[#11100e] px-5 transition-colors duration-300">
      <div className="w-full max-w-sm furnish-card p-8 sm:p-10 bg-white dark:bg-[#181614] shadow-md border border-[#ecebe9] dark:border-[#211f1c]">
        {/* Official Logo / Brand */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <Logo variant="stacked" locale="ar" showSubtitle={true} href="" />
          <p className="mt-3 text-xs uppercase tracking-widest text-[#d47f31] font-semibold">بوابة الإدارة المركزية</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#615b51] dark:text-[#dad7d2]"
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
              className="admin-input"
              placeholder="admin@fahadgsn.com"
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#615b51] dark:text-[#dad7d2]"
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
              className="admin-input"
              placeholder="••••••••"
              aria-invalid={error ? 'true' : undefined}
            />
          </div>

          {error && (
            <p
              id="login-error"
              role="alert"
              className="border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 rounded-none"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                جارٍ التحقق…
              </span>
            ) : (
              'تسجيل الدخول'
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
      <div className="flex min-h-svh items-center justify-center bg-[#f6f5f4] dark:bg-[#11100e]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black dark:border-white border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
