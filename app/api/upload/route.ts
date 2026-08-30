import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { getBucket, getR2PublicUrl } from '@/lib/db/client'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
const MAX_SIZE = 8 * 1024 * 1024 // 8 MB

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
  const workId = (formData.get('productId') as string | null) ?? 'new'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // File type validation
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

  // Build R2 storage key: works/{workId}/{timestamp}.{ext}
  const ext = file.type.includes('jpeg') ? 'jpg'
    : file.type.includes('heic') || file.type.includes('heif') ? 'heic'
    : file.type.split('/')[1]
  const timestamp = Date.now()
  const key = `works/${workId}/${timestamp}.${ext}`

  // Upload to R2
  const bucket = getBucket()
  try {
    await bucket.put(key, await file.arrayBuffer(), {
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
