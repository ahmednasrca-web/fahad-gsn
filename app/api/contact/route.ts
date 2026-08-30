import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDB } from '@/lib/db/client'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  message: z.string().min(1).max(2000),
  workSlug: z.string().max(100).optional(),
  honeypot: z.string().max(0, 'Bot detected'), // must be empty
})

const ipSubmissions = new Map<string, { count: number; expiresAt: number }>()

function pruneExpired(now: number) {
  if (ipSubmissions.size > 200) {
    for (const [key, value] of ipSubmissions.entries()) {
      if (value.expiresAt < now) {
        ipSubmissions.delete(key)
      }
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  pruneExpired(now)
  const record = ipSubmissions.get(ip)
  if (!record || record.expiresAt < now) {
    ipSubmissions.set(ip, { count: 1, expiresAt: now + 10 * 60 * 1000 }) // 10 minutes window
    return false
  }
  if (record.count >= 5) {
    return true
  }
  record.count += 1
  return false
}

export async function POST(request: Request) {
  // Rate limiting by client IP
  const forwardedFor = request.headers.get('x-forwarded-for') ?? request.headers.get('cf-connecting-ip') ?? 'unknown'
  const clientIp = forwardedFor.split(',')[0].trim()
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: 'تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً.' },
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
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const { name, email, phone, message, workSlug, honeypot } = parsed.data

  // Silent honeypot trap
  if (honeypot) {
    return NextResponse.json({ ok: true })
  }

  const db = getDB()
  const id = crypto.randomUUID()

  await db
    .prepare(
      `INSERT INTO contact_messages (id, name, email, phone, message, work_slug)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      name,
      email || null,
      phone || null,
      message,
      workSlug || null,
    )
    .run()

  return NextResponse.json({ ok: true })
}
