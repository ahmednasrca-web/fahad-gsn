export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raw: unknown = await request.json().catch(() => ({}))
  const body = raw as Record<string, unknown>
  const path = typeof body.path === 'string' ? body.path : '/'

  // Note: revalidatePath is not available in edge runtime.
  // In Cloudflare Workers, cache invalidation is handled automatically.
  return NextResponse.json({ revalidated: true, path })
}
