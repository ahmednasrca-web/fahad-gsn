import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/session'
import { getDB } from '@/lib/db/client'
import type { SiteContent } from '@/lib/types'

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const raw = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!raw?.content || typeof raw.content !== 'object') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const db = getDB()
  const entries = Object.entries(raw.content as Record<string, SiteContent>)

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
