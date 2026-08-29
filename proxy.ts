import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession, SESSION_COOKIE } from './lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login and logout routes
  if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  if (!session) {
    // Return 401 JSON for API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Redirect to login for pages
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Pass adminId to route handlers via header
  const response = NextResponse.next()
  response.headers.set('x-admin-id', session.adminId)
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload'],
}
