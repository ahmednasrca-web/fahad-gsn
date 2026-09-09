import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { getBucket, getR2PublicUrl } from '@/lib/db/client'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const MAX_SIZE = 8 * 1024 * 1024 // 8 MB

function isValidImageMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return true
  }

  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return true
  }

  // HEIC / HEIF: ....ftyp (bytes 4-7)
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return true
  }

  return false
}

export async function POST(request: Request) {
  // Admin auth — session cookie only
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const rawWorkId = (formData.get('productId') as string | null) ?? 'new'
  // Sanitize workId to prevent path traversal in storage key
  const workId = rawWorkId.replace(/[^a-zA-Z0-9_-]/g, '') || 'new'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // File MIME type validation
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'نوع الملف غير مدعوم. يرجى رفع صورة JPEG أو PNG أو WebP' },
      { status: 415 },
    )
  }

  // File size limit
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'حجم الملف كبير جداً (الحد الأقصى 8 ميجابايت)' },
      { status: 413 },
    )
  }

  // Binary inspection: verify real image magic bytes
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  if (!isValidImageMagicBytes(bytes)) {
    return NextResponse.json(
      { error: 'محتوى الملف غير صالح أو تالف. يرجى رفع صورة حقيقية سليمة.' },
      { status: 415 },
    )
  }

  // Build R2 storage key: works/{workId}/{timestamp}.{ext}
  const ext = file.type.includes('jpeg') ? 'jpg'
    : file.type.includes('heic') || file.type.includes('heif') ? 'heic'
    : file.type.split('/')[1]
  const timestamp = Date.now()
  const key = `works/${workId}/${timestamp}.${ext}`

  // Upload to R2
  const bucket = getBucket()
  try {
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    })
  } catch (err) {
    console.error('R2 upload failed:', err instanceof Error ? err.message : 'Unknown storage error')
    return NextResponse.json({ error: 'فشل رفع الصورة. حاول مرة أخرى.' }, { status: 500 })
  }

  // Return public URL
  const publicUrl = `${getR2PublicUrl()}/${key}`
  return NextResponse.json({ url: publicUrl })
}
