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
  const { nameAr, nameEn, descriptionAr, descriptionEn, isActive } = parsed.data
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .update({ name_ar: nameAr, name_en: nameEn, description_ar: descriptionAr || null, description_en: descriptionEn || null, is_active: isActive })
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
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
