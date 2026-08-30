import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/session'
import { getDB } from '@/lib/db/client'
import { generateSlug } from '@/lib/slug'

const schema = z.object({
  nameAr: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  descriptionAr: z.string().max(500).optional().nullable(),
  descriptionEn: z.string().max(500).optional().nullable(),
  isActive: z.boolean(),
})

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const _raw: unknown = await request.json().catch(() => null)
  const body = _raw as Record<string, unknown> | null
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { nameAr, nameEn, descriptionAr, descriptionEn, isActive } = parsed.data
  const slug = generateSlug(nameEn, 60)

  const db = getDB()
  const id = crypto.randomUUID()
  await db
    .prepare(
      `INSERT INTO categories (id, slug, name_ar, name_en, description_ar, description_en, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, slug, nameAr, nameEn, descriptionAr ?? null, descriptionEn ?? null, isActive ? 1 : 0)
    .run()

  return NextResponse.json({ id, slug }, { status: 201 })
}
