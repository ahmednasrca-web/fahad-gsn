import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/session'

export async function POST() {
  const response = NextResponse.redirect(
    new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  )
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  response.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  return response
}
