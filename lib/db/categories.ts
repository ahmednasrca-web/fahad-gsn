import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { Category, CategoryRow } from '@/lib/types'

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    descriptionAr: row.description_ar ?? undefined,
    descriptionEn: row.description_en ?? undefined,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }
}

// Public: get all active categories ordered
export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return (data as CategoryRow[]).map(mapCategoryRow)
}

// Admin: get all categories
export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return (data as CategoryRow[]).map(mapCategoryRow)
}

// Admin: get single category by id
export async function getCategoryByIdAdmin(id: string): Promise<Category | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return mapCategoryRow(data as CategoryRow)
}
