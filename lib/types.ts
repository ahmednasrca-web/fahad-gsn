// Fahad Gsn — TypeScript Types

export type Locale = 'ar' | 'en'

export interface Category {
  id: string
  slug: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  sortOrder: number
  isActive: boolean
}

export interface SculpturalHotspot {
  id: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  zoomImage?: string
}

export interface SculptorVision {
  rawImage: string
  finishedImage?: string
  sketchBlueprint?: string
  storyAr: string
  storyEn: string
  quoteAr?: string
  quoteEn?: string
}

export interface PhysicalSpecs {
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  thicknessMm?: number
  weightKg?: number
  finishDetailsAr?: string
  finishDetailsEn?: string
}

export interface FocalPoint {
  x: number // percentage 0-100
  y: number // percentage 0-100
}

export interface Work {
  id: string
  slug: string
  category?: Pick<Category, 'id' | 'slug' | 'nameAr' | 'nameEn'>
  titleAr: string
  titleEn: string
  descriptionAr?: string
  descriptionEn?: string
  price?: number
  primaryImage: string
  images: string[]
  isPublished: boolean
  isFeatured: boolean
  isUniquePiece?: boolean
  storyAr?: string
  storyEn?: string
  sortOrder?: number
  createdAt: string
  hotspots?: SculpturalHotspot[]
  sculptorVision?: SculptorVision
  physicalSpecs?: PhysicalSpecs
  focalPoint?: FocalPoint
}

export interface SiteContent {
  key: string
  valueAr?: string | null
  valueEn?: string | null
}

export interface ContactMessage {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  message: string
  workSlug?: string | null
  isRead: boolean
  createdAt: string
}

// DB row types (snake_case from Supabase)
export interface CategoryRow {
  id: string
  slug: string
  name_ar: string
  name_en: string
  description_ar: string | null
  description_en: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkRow {
  id: string
  slug: string
  category_id: string | null
  title_ar: string
  title_en: string
  description_ar: string | null
  description_en: string | null
  price: number | null
  primary_image_url: string | null
  image_urls: string[]
  is_published: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // joined
  categories?: CategoryRow | null
}

export interface SiteContentRow {
  key: string
  value_ar: string | null
  value_en: string | null
  updated_at: string
}

export interface ContactMessageRow {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string
  work_slug: string | null
  is_read: boolean
  created_at: string
}

export type ReelProvider = 'instagram' | 'youtube' | 'tiktok' | 'facebook'

export interface Reel {
  id: string
  provider: ReelProvider
  originalUrl: string
  contentId: string
  titleAr?: string
  titleEn?: string
  descriptionAr?: string
  descriptionEn?: string
  thumbnailUrl?: string
  isPublished: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ReelRow {
  id: string
  provider: string
  original_url: string
  content_id: string
  title_ar: string | null
  title_en: string | null
  description_ar: string | null
  description_en: string | null
  thumbnail_url: string | null
  is_published: number | boolean
  is_featured: number | boolean
  sort_order: number
  created_at: string
  updated_at: string
}

