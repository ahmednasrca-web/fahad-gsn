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
  story_ar: string | null
  story_en: string | null
  price: number | null
  primary_image_url: string | null
  image_urls: string // JSON string
  is_published: number
  is_featured: number
  is_unique_piece: number
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
  
  // Curated demo hotspots for unique pieces if not yet customized in admin
  const isDemoSpecialPiece = row.slug.includes('walnut') || row.slug.includes('olive') || Boolean(row.is_unique_piece)
  const defaultHotspots = isDemoSpecialPiece ? [
    {
      id: 'hs-1',
      x: 32,
      y: 42,
      titleAr: 'العقدة النحتية المحررة (Liberated Burl)',
      titleEn: 'Liberated Sculptural Burl',
      descAr: 'التواء جذع طبيعي عمره عقود تم تفريغه ونحته يدوياً بأزاميل دمشقية ليصبح بؤرة الجمال في التحفة دون قصه.',
      descEn: 'A natural aged tree knot sculpted by hand with Damascus chisels, preserving its organic gravitational core.',
    },
    {
      id: 'hs-2',
      x: 74,
      y: 68,
      titleAr: 'انسياب الشلال الحي (Waterfall Grain Flow)',
      titleEn: 'Continuous Waterfall Grain Flow',
      descAr: 'تدفق ألياف الخشب المستمر من سطح الطاولة إلى الأرجل بزاوية 90° كشلال طبيعي متصل دون أي فواصل مرئية.',
      descEn: 'Unbroken wood fiber grain transitioning at 90 degrees from slab surface to legs with seamless continuity.',
    },
    {
      id: 'hs-3',
      x: 52,
      y: 28,
      titleAr: 'صنفرة الحرير العضوي (2000 Grit Silky Finish)',
      titleEn: '2000 Grit Organic Satin Finish',
      descAr: 'صنفرة يدوية متدرجة عبر 8 مراحل مجهرية تعقبها تغذية بخلطة الزيوت الإيطالية وشمع العسل الطبيعي.',
      descEn: '8-stage hand sanding honed to 2000 grit, nourished exclusively with organic Italian oils and raw beeswax.',
    }
  ] : undefined

  const defaultSculptorVision = isDemoSpecialPiece ? {
    rawImage: '/transformation/raw-walnut.jpg',
    finishedImage: row.primary_image_url ?? images[0] ?? '/transformation/finished-walnut.jpg',
    sketchBlueprint: '/transformation/raw-walnut.jpg',
    storyAr: 'حين عثرنا على هذا الجذع في الورشة، كان ملتوياً ومليئاً بالعقد المتشابكة. رأى الحرفي فهد غصن خطوط المنحوتة المخفية في باطن الخشب، وقرر تحريرها دون فرض خطوط صناعية عليها.',
    storyEn: 'When we uncovered this raw aged trunk, it was wildly twisted with deep burl knots. Artisan Fahad Gsn perceived the hidden sculpture sleeping within and liberated its organic flow.',
    quoteAr: 'التصميم الحقيقي لا يُفرض على الخشب.. بل يُستخرج من روح الشجرة وانحناءاتها الطبيعية.',
    quoteEn: 'True design is never imposed upon timber; it is liberated from the organic spirit of the tree.',
  } : undefined

  const defaultPhysicalSpecs = {
    lengthCm: 240,
    widthCm: 105,
    heightCm: 76,
    thicknessMm: 65,
    weightKg: 115,
    finishDetailsAr: 'زيوت عضوية إيطالية مخصصة غير لامعة (Matte Satin) + شمع نحل نقي 100% مقاوم للسوائل والحرارة.',
    finishDetailsEn: 'Custom Italian organic matte satin oils + 100% natural beeswax shield against liquids and heat.',
  }

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
    storyAr: row.story_ar ?? undefined,
    storyEn: row.story_en ?? undefined,
    price: row.price ?? undefined,
    primaryImage: row.primary_image_url ?? images[0] ?? '',
    images,
    isPublished: Boolean(row.is_published),
    isFeatured: Boolean(row.is_featured),
    isUniquePiece: Boolean(row.is_unique_piece),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    hotspots: defaultHotspots,
    sculptorVision: defaultSculptorVision,
    physicalSpecs: defaultPhysicalSpecs,
    focalPoint: { x: 50, y: 50 },
  }
}

const SELECT_COLS = `
  w.id, w.slug, w.category_id, w.title_ar, w.title_en, w.description_ar, w.description_en,
  w.story_ar, w.story_en, w.price, w.primary_image_url, w.image_urls, w.is_published,
  w.is_featured, w.is_unique_piece, w.sort_order, w.created_at,
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

export async function reorderWorksAdmin(workIds: string[]): Promise<void> {
  const db = getDB()
  const stmts = workIds.map((id, index) =>
    db.prepare('UPDATE works SET sort_order = ?, updated_at = datetime(\'now\') WHERE id = ?').bind(index, id)
  )
  await db.batch(stmts)
}
