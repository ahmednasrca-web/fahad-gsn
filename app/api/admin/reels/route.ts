import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { getDB } from '@/lib/db/client'
import { detectAndValidateReelUrl } from '@/lib/reels/providers'

const schema = z.object({
  url: z.string().url('يرجى إدخال رابط صالح'),
  titleAr: z.string().max(200).optional().nullable(),
  titleEn: z.string().max(200).optional().nullable(),
  descriptionAr: z.string().max(2000).optional().nullable(),
  descriptionEn: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? await verifySession(token) : null
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDB()
  const { results } = await db
    .prepare('SELECT * FROM reels ORDER BY sort_order ASC, created_at DESC')
    .all()
  return NextResponse.json(results)
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const _raw: unknown = await request.json().catch(() => null)
  const body = _raw as Record<string, unknown> | null
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'بيانات غير صالحة' },
      { status: 400 },
    )
  }

  const { url, titleAr, titleEn, descriptionAr, descriptionEn, sortOrder, isPublished, isFeatured } = parsed.data

  // Validate URL and detect provider
  let validationResult
  try {
    validationResult = detectAndValidateReelUrl(url)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'رابط غير مدعوم' },
      { status: 400 },
    )
  }

  const db = getDB()
  const id = crypto.randomUUID()

  await db
    .prepare(
      `INSERT INTO reels (
        id, provider, original_url, content_id, title_ar, title_en,
        description_ar, description_en, thumbnail_url, is_published, is_featured, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      validationResult.provider,
      validationResult.originalUrl,
      validationResult.contentId,
      titleAr?.trim() || null,
      titleEn?.trim() || null,
      descriptionAr?.trim() || null,
      descriptionEn?.trim() || null,
      validationResult.thumbnailUrl || null,
      isPublished ? 1 : 0,
      isFeatured ? 1 : 0,
      sortOrder ?? 0,
    )
    .run()

  return NextResponse.json(
    { id, provider: validationResult.provider, contentId: validationResult.contentId },
    { status: 201 },
  )
}
