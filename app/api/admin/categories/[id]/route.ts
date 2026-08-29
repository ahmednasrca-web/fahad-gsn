import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { getDB } from '@/lib/db/client'

const schema = z.object({
  nameAr: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  descriptionAr: z.string().max(500).optional().nullable(),
  descriptionEn: z.string().max(500).optional().nullable(),
  isActive: z.boolean(),
})

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? await verifySession(token) : null
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const _raw: unknown = await request.json().catch(() => null)
  const body = _raw as Record<string, unknown> | null
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { nameAr, nameEn, descriptionAr, descriptionEn, isActive } = parsed.data
  const db = getDB()
  await db
    .prepare(
      `UPDATE categories SET name_ar = ?, name_en = ?, description_ar = ?, description_en = ?,
       is_active = ?, updated_at = datetime('now') WHERE id = ?`,
    )
    .bind(nameAr, nameEn, descriptionAr ?? null, descriptionEn ?? null, isActive ? 1 : 0, id)
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
  await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
  return NextResponse.json({ ok: true })
}
