import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { reorderWorksAdmin } from '@/lib/db/works'

const schema = z.object({
  ids: z.array(z.string()).min(1),
})

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? await verifySession(token) : null
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: unknown = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  try {
    await reorderWorksAdmin(parsed.data.ids)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to reorder works:', err)
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 })
  }
}
