import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  message: z.string().min(1).max(2000),
  workSlug: z.string().max(100).optional(),
  honeypot: z.string().max(0, 'Bot detected'), // must be empty
})

// Simple in-memory rate limiter — acceptable for a single-admin site
const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 3   // max 3 submissions
const RATE_WINDOW = 60 * 60 * 1000 // per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

export async function POST(request: Request) {
  // Get IP for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    // Don't reveal specifics
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const { name, email, phone, message, workSlug, honeypot } = parsed.data

  // Double-check honeypot (schema already rejects non-empty, but be explicit)
  if (honeypot) {
    return NextResponse.json({ ok: true }) // silently succeed for bots
  }

  const supabase = createSupabaseAdminClient()
  const { error: dbError } = await supabase.from('contact_messages').insert({
    name,
    email: email || null,
    phone: phone || null,
    message,
    work_slug: workSlug || null,
  })

  if (dbError) {
    console.error('Contact form DB error:', dbError)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
