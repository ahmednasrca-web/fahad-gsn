import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  titleAr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  descriptionAr: z.string().max(5000).optional().nullable(),
  descriptionEn: z.string().max(5000).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  images: z.array(z.string().url()).max(20),
  primaryImage: z.string().url().optional().nullable(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
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
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { titleAr, titleEn, descriptionAr, descriptionEn, categoryId, price, images, primaryImage, isPublished, isFeatured } = parsed.data

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('works')
    .update({
      title_ar: titleAr,
      title_en: titleEn,
      description_ar: descriptionAr || null,
      description_en: descriptionEn || null,
      category_id: categoryId || null,
      price: price ?? null,
      image_urls: images,
      primary_image_url: primaryImage || images[0] || null,
      is_published: isPublished,
      is_featured: isFeatured,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('works').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
