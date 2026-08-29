import { getDB } from './client'
import type { Reel, ReelProvider } from '@/lib/types'

interface D1ReelRow {
  id: string
  provider: string
  original_url: string
  content_id: string
  title_ar: string | null
  title_en: string | null
  description_ar: string | null
  description_en: string | null
  thumbnail_url: string | null
  is_published: number
  is_featured: number
  sort_order: number
  created_at: string
  updated_at: string
}

function mapReelRow(row: D1ReelRow): Reel {
  return {
    id: row.id,
    provider: row.provider as ReelProvider,
    originalUrl: row.original_url,
    contentId: row.content_id,
    titleAr: row.title_ar ?? undefined,
    titleEn: row.title_en ?? undefined,
    descriptionAr: row.description_ar ?? undefined,
    descriptionEn: row.description_en ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    isPublished: Boolean(row.is_published),
    isFeatured: Boolean(row.is_featured),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ─── Public Queries ────────────────────────────────────────────────────────────

export async function getPublishedReels(): Promise<Reel[]> {
  try {
    const db = getDB()
    const { results } = await db
      .prepare(
        'SELECT * FROM reels WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC',
      )
      .all<D1ReelRow>()
    return (results ?? []).map(mapReelRow)
  } catch (err) {
    console.error('getPublishedReels error:', err)
    return []
  }
}

export async function getFeaturedReels(limit = 4): Promise<Reel[]> {
  try {
    const db = getDB()
    const { results } = await db
      .prepare(
        'SELECT * FROM reels WHERE is_published = 1 AND is_featured = 1 ORDER BY sort_order ASC, created_at DESC LIMIT ?',
      )
      .bind(limit)
      .all<D1ReelRow>()
    return (results ?? []).map(mapReelRow)
  } catch (err) {
    console.error('getFeaturedReels error:', err)
    return []
  }
}

// ─── Admin Queries ─────────────────────────────────────────────────────────────

export async function getAllReelsAdmin(): Promise<Reel[]> {
  try {
    const db = getDB()
    const { results } = await db
      .prepare('SELECT * FROM reels ORDER BY sort_order ASC, created_at DESC')
      .all<D1ReelRow>()
    return (results ?? []).map(mapReelRow)
  } catch (err) {
    console.error('getAllReelsAdmin error:', err)
    return []
  }
}

export async function getReelByIdAdmin(id: string): Promise<Reel | null> {
  try {
    const db = getDB()
    const row = await db
      .prepare('SELECT * FROM reels WHERE id = ?')
      .bind(id)
      .first<D1ReelRow>()
    return row ? mapReelRow(row) : null
  } catch (err) {
    console.error('getReelByIdAdmin error:', err)
    return null
  }
}

export async function reorderReelsAdmin(reelIds: string[]): Promise<void> {
  const db = getDB()
  const stmts = reelIds.map((id, index) =>
    db.prepare('UPDATE reels SET sort_order = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(index, id)
  )
  await db.batch(stmts)
}

