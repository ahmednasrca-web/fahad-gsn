import { NextResponse } from 'next/server'
import { z } from 'zod'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'
import { verifyPassword } from '@/lib/auth'
import { getDB } from '@/lib/db/client'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
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
    // Generic error — don't reveal whether email exists
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
  }

  // Verify password using PBKDF2 (Web Crypto API)
  const isValid = await verifyPassword(password, adminUser.password_hash)
  if (!isValid) {
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
  }

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
