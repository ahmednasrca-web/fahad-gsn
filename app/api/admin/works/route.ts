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

function generateSlug(titleEn: string): string {
  return (
    titleEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) +
    '-' +
    Date.now().toString(36)
  )
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.from('works').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { titleAr, titleEn, descriptionAr, descriptionEn, categoryId, price, images, primaryImage, isPublished, isFeatured } = parsed.data

  const supabase = createSupabaseAdminClient()
  let slug = generateSlug(titleEn)
  const { data: existing } = await supabase.from('works').select('id').eq('slug', slug).maybeSingle()
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`

  const { data, error } = await supabase.from('works').insert({
    slug,
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
  }).select().single()

  if (error) {
    console.error('Create work error:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
