import { getDB } from './client'
import type { SiteContent } from '@/lib/types'

interface D1ContentRow {
  key: string
  value_ar: string | null
  value_en: string | null
}

export async function getSiteContent(): Promise<Record<string, SiteContent>> {
  const db = getDB()
  const { results } = await db
    .prepare('SELECT key, value_ar, value_en FROM site_content')
    .all<D1ContentRow>()

  const map: Record<string, SiteContent> = {}
  for (const row of results) {
    map[row.key] = { key: row.key, valueAr: row.value_ar, valueEn: row.value_en }
  }
  return map
}

export async function getContentValue(
  key: string,
  locale: 'ar' | 'en' = 'ar',
): Promise<string> {
  const db = getDB()
  const row = await db
    .prepare('SELECT value_ar, value_en FROM site_content WHERE key = ?')
    .bind(key)
    .first<{ value_ar: string | null; value_en: string | null }>()
  if (!row) return ''
  return (locale === 'ar' ? row.value_ar : row.value_en) ?? ''
}
