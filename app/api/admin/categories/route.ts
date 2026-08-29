import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

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

function generateSlug(nameEn: string): string {
  return (
    nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) +
    '-' +
    Date.now().toString(36)
  )
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  const { nameAr, nameEn, descriptionAr, descriptionEn, isActive } = parsed.data
  const supabase = createSupabaseAdminClient()
  const slug = generateSlug(nameEn)
  const { data, error } = await supabase.from('categories').insert({
    slug,
    name_ar: nameAr,
    name_en: nameEn,
    description_ar: descriptionAr || null,
    description_en: descriptionEn || null,
    is_active: isActive,
  }).select().single()
  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
