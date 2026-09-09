import { NextResponse } from 'next/server'
import { z } from 'zod'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'
import { verifyPassword } from '@/lib/auth'
import { getDB } from '@/lib/db/client'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

interface LoginAttempt {
  count: number
  lockUntil: number
}

const loginAttempts = new Map<string, LoginAttempt>()

function pruneLoginAttempts(now: number) {
  if (loginAttempts.size > 200) {
    for (const [key, value] of loginAttempts.entries()) {
      if (value.lockUntil < now) {
        loginAttempts.delete(key)
      }
    }
  }
}

function checkLoginRateLimit(ip: string): { limited: boolean; remainingMinutes?: number } {
  const now = Date.now()
  pruneLoginAttempts(now)
  const attempt = loginAttempts.get(ip)
  if (attempt && attempt.count >= 5 && attempt.lockUntil > now) {
    const remainingMinutes = Math.ceil((attempt.lockUntil - now) / 60000)
    return { limited: true, remainingMinutes }
  }
  return { limited: false }
}

function recordLoginFailure(ip: string) {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)
  if (!attempt || attempt.lockUntil < now) {
    loginAttempts.set(ip, { count: 1, lockUntil: now + 15 * 60 * 1000 })
  } else {
    attempt.count += 1
    if (attempt.count >= 5) {
      attempt.lockUntil = now + 15 * 60 * 1000 // lock for 15 mins
    }
  }
}

export async function POST(request: Request) {
  const clientIp =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'

  // Check rate limit for brute-force protection
  const { limited, remainingMinutes } = checkLoginRateLimit(clientIp)
  if (limited) {
    return NextResponse.json(
      {
        error: `تم تجاوز الحد المسموح به لمحاولات الدخول. يرجى الانتظار لمدة ${remainingMinutes} دقيقة قبل المحاولة مرة أخرى.`,
      },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    recordLoginFailure(clientIp)
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 400 })
  }

  const { email, password } = parsed.data

  // Look up admin user in D1
  const db = getDB()
  const adminUser = await db
    .prepare('SELECT id, password_hash FROM admin_users WHERE email = ?')
    .bind(email.toLowerCase().trim())
    .first<{ id: string; password_hash: string }>()

  if (!adminUser) {
    recordLoginFailure(clientIp)
    // Generic error — don't reveal whether email exists
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
  }

  // Verify password using PBKDF2 (Web Crypto API)
  const isValid = await verifyPassword(password, adminUser.password_hash)
  if (!isValid) {
    recordLoginFailure(clientIp)
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
  }

  // Reset login attempts on success
  loginAttempts.delete(clientIp)

  // Create HMAC session token
  const token = await signSession({ adminId: adminUser.id })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return response
}
