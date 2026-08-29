import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { getDB } from '@/lib/db/client'

const schema = z.object({
  titleAr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  descriptionAr: z.string().max(5000).optional().nullable(),
  descriptionEn: z.string().max(5000).optional().nullable(),
  storyAr: z.string().max(5000).optional().nullable(),
  storyEn: z.string().max(5000).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  images: z.array(z.string()).max(20),
  primaryImage: z.string().optional().nullable(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  isUniquePiece: z.boolean().optional(),
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

  const { titleAr, titleEn, descriptionAr, descriptionEn, storyAr, storyEn, categoryId, price, images, primaryImage, isPublished, isFeatured, isUniquePiece } = parsed.data

  const db = getDB()
  const { success } = await db
    .prepare(
      `UPDATE works SET
        title_ar = ?, title_en = ?, description_ar = ?, description_en = ?,
        story_ar = ?, story_en = ?, category_id = ?, price = ?, image_urls = ?, primary_image_url = ?,
        is_published = ?, is_featured = ?, is_unique_piece = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(
      titleAr, titleEn,
      descriptionAr ?? null, descriptionEn ?? null,
      storyAr ?? null, storyEn ?? null,
      categoryId ?? null, price ?? null,
      JSON.stringify(images),
      primaryImage ?? images[0] ?? null,
      isPublished ? 1 : 0, isFeatured ? 1 : 0,
      isUniquePiece ? 1 : 0,
      id,
    )
    .run()

  if (!success) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
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
  await db.prepare('DELETE FROM works WHERE id = ?').bind(id).run()
  return NextResponse.json({ ok: true })
}
