import { getDB } from './client'
import type { Work } from '@/lib/types'

// D1 row shape returned by JOIN queries
interface D1WorkRow {
  id: string
  slug: string
  category_id: string | null
  title_ar: string
  title_en: string
  description_ar: string | null
  description_en: string | null
  price: number | null
  primary_image_url: string | null
  image_urls: string // JSON string
  is_published: number
  is_featured: number
  sort_order: number
  created_at: string
  // From LEFT JOIN categories:
  cat_id: string | null
  cat_slug: string | null
  cat_name_ar: string | null
  cat_name_en: string | null
}

function parseImages(raw: string): string[] {
  try { return JSON.parse(raw) } catch { return [] }
}

function mapWorkRow(row: D1WorkRow): Work {
  const images = parseImages(row.image_urls)
  return {
    id: row.id,
    slug: row.slug,
    category: row.cat_id
      ? { id: row.cat_id, slug: row.cat_slug!, nameAr: row.cat_name_ar!, nameEn: row.cat_name_en! }
      : undefined,
    titleAr: row.title_ar,
    titleEn: row.title_en,
    descriptionAr: row.description_ar ?? undefined,
    descriptionEn: row.description_en ?? undefined,
    price: row.price ?? undefined,
    primaryImage: row.primary_image_url ?? images[0] ?? '',
    images,
    isPublished: Boolean(row.is_published),
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at,
  }
}

const SELECT_COLS = `
  w.id, w.slug, w.category_id, w.title_ar, w.title_en, w.description_ar, w.description_en,
  w.price, w.primary_image_url, w.image_urls, w.is_published, w.is_featured, w.sort_order, w.created_at,
  c.id AS cat_id, c.slug AS cat_slug, c.name_ar AS cat_name_ar, c.name_en AS cat_name_en
`

// ─── Public queries ────────────────────────────────────────────────────────────

export async function getPublishedWorks(categorySlug?: string): Promise<Work[]> {
  const db = getDB()

  if (categorySlug) {
    const catRow = await db
      .prepare('SELECT id FROM categories WHERE slug = ? AND is_active = 1')
      .bind(categorySlug)
      .first<{ id: string }>()
    if (!catRow) return []

    const { results } = await db
      .prepare(
        `SELECT ${SELECT_COLS} FROM works w
         LEFT JOIN categories c ON w.category_id = c.id
         WHERE w.is_published = 1 AND w.category_id = ?
         ORDER BY w.sort_order ASC, w.created_at DESC`,
      )
      .bind(catRow.id)
      .all<D1WorkRow>()
    return results.map(mapWorkRow)
  }

  const { results } = await db
    .prepare(
      `SELECT ${SELECT_COLS} FROM works w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE w.is_published = 1
       ORDER BY w.sort_order ASC, w.created_at DESC`,
    )
    .all<D1WorkRow>()
  return results.map(mapWorkRow)
}

export async function getFeaturedWorks(limit = 6): Promise<Work[]> {
  const db = getDB()
  const { results } = await db
    .prepare(
      `SELECT ${SELECT_COLS} FROM works w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE w.is_published = 1 AND w.is_featured = 1
       ORDER BY w.sort_order ASC
       LIMIT ?`,
    )
    .bind(limit)
    .all<D1WorkRow>()
  return results.map(mapWorkRow)
}

export async function getPublishedWorkBySlug(slug: string): Promise<Work | null> {
  const db = getDB()
  const row = await db
    .prepare(
      `SELECT ${SELECT_COLS} FROM works w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE w.slug = ? AND w.is_published = 1`,
    )
    .bind(slug)
    .first<D1WorkRow>()
  return row ? mapWorkRow(row) : null
}

export async function getAllPublishedWorkSlugs(): Promise<string[]> {
  const db = getDB()
  const { results } = await db
    .prepare('SELECT slug FROM works WHERE is_published = 1')
    .all<{ slug: string }>()
  return results.map((r) => r.slug)
}

// ─── Admin queries ─────────────────────────────────────────────────────────────

export async function getAllWorksAdmin(): Promise<Work[]> {
  const db = getDB()
  const { results } = await db
    .prepare(
      `SELECT ${SELECT_COLS} FROM works w
       LEFT JOIN categories c ON w.category_id = c.id
       ORDER BY w.created_at DESC`,
    )
    .all<D1WorkRow>()
  return results.map(mapWorkRow)
}

export async function getWorkByIdAdmin(id: string): Promise<Work | null> {
  const db = getDB()
  const row = await db
    .prepare(
      `SELECT ${SELECT_COLS} FROM works w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE w.id = ?`,
    )
    .bind(id)
    .first<D1WorkRow>()
  return row ? mapWorkRow(row) : null
}
