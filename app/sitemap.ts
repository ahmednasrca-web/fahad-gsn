export const runtime = 'edge'

import type { MetadataRoute } from 'next'
import { getAllPublishedWorkSlugs } from '@/lib/db/works'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahadgsn.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let workSlugs: string[] = []

  // Safe: don't fail build if Supabase not configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      workSlugs = await getAllPublishedWorkSlugs()
    } catch {
      workSlugs = []
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const workPages: MetadataRoute.Sitemap = workSlugs.map((slug) => ({
    url: `${SITE_URL}/gallery/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...workPages]
}
