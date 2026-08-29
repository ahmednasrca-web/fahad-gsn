import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession, SESSION_COOKIE } from './lib/session'

export async function proxy(request: NextRequest) {
  // Don't protect the login page itself
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Pass adminId to route handlers via header
  const response = NextResponse.next()
  response.headers.set('x-admin-id', session.adminId)
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
