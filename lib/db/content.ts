import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { SiteContent, SiteContentRow } from '@/lib/types'

function mapContentRow(row: SiteContentRow): SiteContent {
  return {
    key: row.key,
    valueAr: row.value_ar,
    valueEn: row.value_en,
  }
}

// Public + Admin: get all site content as a map
export async function getSiteContent(): Promise<Record<string, SiteContent>> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
  if (error || !data) return {}
  const result: Record<string, SiteContent> = {}
  for (const row of data as SiteContentRow[]) {
    result[row.key] = mapContentRow(row)
  }
  return result
}

// Convenience: get a single content value
export async function getContentValue(key: string, locale: 'ar' | 'en'): Promise<string | null> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('site_content')
    .select('value_ar, value_en')
    .eq('key', key)
    .single()
  if (!data) return null
  return locale === 'ar' ? data.value_ar : data.value_en
}
