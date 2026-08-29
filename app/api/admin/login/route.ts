import { NextResponse } from 'next/server'
import { z } from 'zod'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  // Parse + validate body
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

  // Authenticate via Supabase Auth
  // We use the regular Supabase client for auth, then create our own HMAC session
  const { createSupabaseServerClient } = await import('@/lib/supabase/server')
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    // Generic error — don't reveal whether email or password is wrong
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
  }

  // Create our HMAC session token
  const token = await signSession({ adminId: data.user.id })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return response
}
