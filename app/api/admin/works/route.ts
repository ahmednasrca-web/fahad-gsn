import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/session'
import { getDB } from '@/lib/db/client'
import { generateSlug } from '@/lib/slug'

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

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDB()
  const { results } = await db
    .prepare('SELECT * FROM works ORDER BY created_at DESC')
    .all()
  return NextResponse.json(results)
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const _raw: unknown = await request.json().catch(() => null)
  const body = _raw as Record<string, unknown> | null
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { titleAr, titleEn, descriptionAr, descriptionEn, storyAr, storyEn, categoryId, price, images, primaryImage, isPublished, isFeatured, isUniquePiece } = parsed.data

  const db = getDB()
  const id = crypto.randomUUID()
  let slug = generateSlug(titleEn)

  // Ensure slug uniqueness
  const existing = await db.prepare('SELECT id FROM works WHERE slug = ?').bind(slug).first()
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`

  await db
    .prepare(
      `INSERT INTO works (id, slug, title_ar, title_en, description_ar, description_en, story_ar, story_en, category_id, price,
        image_urls, primary_image_url, is_published, is_featured, is_unique_piece)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id, slug, titleAr, titleEn,
      descriptionAr ?? null, descriptionEn ?? null,
      storyAr ?? null, storyEn ?? null,
      categoryId ?? null, price ?? null,
      JSON.stringify(images),
      primaryImage ?? images[0] ?? null,
      isPublished ? 1 : 0, isFeatured ? 1 : 0,
      isUniquePiece ? 1 : 0,
    )
    .run()

  return NextResponse.json({ id, slug }, { status: 201 })
}
