import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/session'
import { getDB } from '@/lib/db/client'

const contentItemSchema = z.object({
  key: z.string().optional(),
  valueAr: z.string().max(10000).optional().nullable(),
  valueEn: z.string().max(10000).optional().nullable(),
})

const schema = z.object({
  content: z.record(z.string().min(1).max(100), contentItemSchema),
})

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raw = await request.json().catch(() => null)
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
  }

  const db = getDB()
  const entries = Object.entries(parsed.data.content)

  // D1 batch upserts
  const statements = entries.map(([key, val]) =>
    db
      .prepare(
        `INSERT INTO site_content (key, value_ar, value_en) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value_ar = excluded.value_ar, value_en = excluded.value_en, updated_at = datetime('now')`,
      )
      .bind(key, val.valueAr ?? null, val.valueEn ?? null),
  )

  if (statements.length > 0) {
    await db.batch(statements)
  }

  return NextResponse.json({ ok: true })
}
