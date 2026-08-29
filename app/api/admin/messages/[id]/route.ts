export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { getDB } from '@/lib/db/client'

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? await verifySession(token) : null
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => ({}) as Record<string, unknown>)
  const db = getDB()
  const isRead = Boolean((body as Record<string, unknown>).isRead)
  await db
    .prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?')
    .bind(isRead ? 1 : 0, id)
    .run()

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = getDB()
  await db.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id).run()
  return NextResponse.json({ ok: true })
}
