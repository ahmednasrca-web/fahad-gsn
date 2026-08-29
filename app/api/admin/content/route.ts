import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { SiteContent } from '@/lib/types'

async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? await verifySession(token) : null
}

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body?.content || typeof body.content !== 'object') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const updates = Object.entries(body.content as Record<string, SiteContent>).map(
    ([key, val]) => ({
      key,
      value_ar: val.valueAr ?? null,
      value_en: val.valueEn ?? null,
    }),
  )

  // Upsert all content fields
  const errors: string[] = []
  for (const item of updates) {
    const { error } = await supabase
      .from('site_content')
      .upsert(item, { onConflict: 'key' })
    if (error) errors.push(item.key)
  }

  if (errors.length > 0) {
    console.error('Content save errors for keys:', errors)
    return NextResponse.json({ error: 'Some fields failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
