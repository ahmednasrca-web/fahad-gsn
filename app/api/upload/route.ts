import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import sharp from 'sharp'

// Magic bytes for file type validation
const MAGIC: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'image/heic': [[0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]],
}

function detectMimeType(buffer: Buffer): string | null {
  for (const [mime, signatures] of Object.entries(MAGIC)) {
    for (const sig of signatures) {
      if (sig.every((byte, i) => buffer[i] === byte)) return mime
    }
  }
  return null
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
  const workId = (formData.get('productId') as string | null) ?? 'new'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // File size limit — generous, Sharp will compress to WebP ≤1080²
  const maxSize = 8 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 8 MB)' }, { status: 413 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Magic bytes validation
  const detectedMime = detectMimeType(buffer)
  if (!detectedMime) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
  }

  // Process with Sharp: auto-rotate EXIF, resize to max 1080², convert to WebP
  let processed: Buffer
  try {
    processed = await sharp(buffer)
      .rotate() // auto-rotate based on EXIF (fixes iPhone photos)
      .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
  } catch {
    return NextResponse.json({ error: 'Image processing failed' }, { status: 422 })
  }

  // Storage path: works/{workId}/{timestamp}.webp
  const timestamp = Date.now()
  const storagePath = `works/${workId}/${timestamp}.webp`

  const supabase = createSupabaseAdminClient()
  const { error: uploadError } = await supabase.storage
    .from('works')
    .upload(storagePath, processed, {
      contentType: 'image/webp',
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from('works').getPublicUrl(storagePath)

  return NextResponse.json({ url: urlData.publicUrl })
}
