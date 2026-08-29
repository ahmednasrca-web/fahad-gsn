import { getDB } from './client'
import type { Category } from '@/lib/types'

interface D1CategoryRow {
  id: string
  slug: string
  name_ar: string
  name_en: string
  description_ar: string | null
  description_en: string | null
  sort_order: number
  is_active: number
  created_at: string
}

function mapCategoryRow(row: D1CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    descriptionAr: row.description_ar ?? undefined,
    descriptionEn: row.description_en ?? undefined,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }
}

// ─── Public ────────────────────────────────────────────────────────────────────

export async function getActiveCategories(): Promise<Category[]> {
  const db = getDB()
  const { results } = await db
    .prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC')
    .all<D1CategoryRow>()
  return results.map(mapCategoryRow)
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const db = getDB()
  const { results } = await db
    .prepare('SELECT * FROM categories ORDER BY sort_order ASC')
    .all<D1CategoryRow>()
  return results.map(mapCategoryRow)
}

export async function getCategoryByIdAdmin(id: string): Promise<Category | null> {
  const db = getDB()
  const row = await db
    .prepare('SELECT * FROM categories WHERE id = ?')
    .bind(id)
    .first<D1CategoryRow>()
  return row ? mapCategoryRow(row) : null
}
