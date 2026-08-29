import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { Work, WorkRow } from '@/lib/types'

function mapWorkRow(row: WorkRow): Work {
  return {
    id: row.id,
    slug: row.slug,
    category: row.categories
      ? {
          id: row.categories.id,
          slug: row.categories.slug,
          nameAr: row.categories.name_ar,
          nameEn: row.categories.name_en,
        }
      : undefined,
    titleAr: row.title_ar,
    titleEn: row.title_en,
    descriptionAr: row.description_ar ?? undefined,
    descriptionEn: row.description_en ?? undefined,
    price: row.price ?? undefined,
    primaryImage: row.primary_image_url ?? row.image_urls?.[0] ?? '',
    images: row.image_urls ?? [],
    isPublished: row.is_published,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
  }
}

const WORK_SELECT = `
  id, slug, category_id, title_ar, title_en, description_ar, description_en,
  price, primary_image_url, image_urls, is_published, is_featured, sort_order, created_at, updated_at,
  categories ( id, slug, name_ar, name_en )
`

// Public: get all published works (with optional category filter)
export async function getPublishedWorks(categorySlug?: string): Promise<Work[]> {
  const supabase = createSupabaseAdminClient()
  let query = supabase
    .from('works')
    .select(WORK_SELECT)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (categorySlug) {
    // Filter by category slug via join
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (cat) {
      query = query.eq('category_id', cat.id)
    } else {
      return []
    }
  }

  const { data, error } = await query
  if (error || !data) return []
  return (data as unknown as WorkRow[]).map(mapWorkRow)
}

// Public: get featured works
export async function getFeaturedWorks(limit = 6): Promise<Work[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('works')
    .select(WORK_SELECT)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(limit)
  if (error || !data) return []
  return (data as unknown as WorkRow[]).map(mapWorkRow)
}

// Public: get single published work by slug
export async function getPublishedWorkBySlug(slug: string): Promise<Work | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('works')
    .select(WORK_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error || !data) return null
  return mapWorkRow(data as unknown as WorkRow)
}

// Public: get all published slugs (for generateStaticParams)
export async function getAllPublishedWorkSlugs(): Promise<string[]> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('works')
    .select('slug')
    .eq('is_published', true)
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

// Admin: get all works (published + unpublished)
export async function getAllWorksAdmin(): Promise<Work[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('works')
    .select(WORK_SELECT)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as unknown as WorkRow[]).map(mapWorkRow)
}

// Admin: get single work by id (any status)
export async function getWorkByIdAdmin(id: string): Promise<Work | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('works')
    .select(WORK_SELECT)
    .eq('id', id)
    .single()
  if (error || !data) return null
  return mapWorkRow(data as unknown as WorkRow)
}
