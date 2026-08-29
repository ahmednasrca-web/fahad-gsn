import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { getDir, t, getWorkTitle, getCategoryName } from '@/lib/i18n'
import { getPublishedWorks } from '@/lib/db/works'
import { getActiveCategories } from '@/lib/db/categories'
import CategoryFilter from '@/components/works/CategoryFilter'

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'المعرض | فهد غصن' : 'Gallery | Fahad Gsn',
    description: locale === 'ar'
      ? 'استعرض أعمالنا الخشبية اليدوية الفاخرة'
      : 'Browse our luxury handcrafted wood works',
  }
}

export const revalidate = 60

export default async function GalleryPage({ searchParams }: PageProps) {
  const locale = await getLocale()
  const dir = getDir(locale)
  const { category: categorySlug } = await searchParams

  const [categories, works] = await Promise.all([
    getActiveCategories(),
    getPublishedWorks(categorySlug),
  ])

  return (
    <div dir={dir} className="section-padding">
      <div className="container-site">
        {/* Page header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4854A]">
            {locale === 'ar' ? 'أعمالنا' : 'Our Works'}
          </p>
          <h1 className="text-4xl font-bold text-[#1A1209] md:text-5xl">
            {t(locale, 'gallery')}
          </h1>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              activeSlug={categorySlug}
              locale={locale}
            />
          </div>
        )}

        {/* Works grid */}
        {works.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl" aria-hidden="true">🪵</p>
            <p className="mt-4 text-lg font-medium text-[#3D2B1A]">
              {t(locale, 'noWorks')}
            </p>
          </div>
        ) : (
          <div className="gallery-grid">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/gallery/${work.slug}`}
                className="work-card group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E8DDD0] transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-work-card overflow-hidden bg-[#F5F0E8]">
                  {work.primaryImage ? (
                    <Image
                      src={work.primaryImage}
                      alt={getWorkTitle(work, locale)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="work-card-image object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl text-[#D4B896]" aria-hidden="true">🪵</span>
                    </div>
                  )}
                  {/* Category badge */}
                  {work.category && (
                    <span className="absolute bottom-2 start-2 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {getCategoryName(work.category, locale)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-[#1A1209]">
                    {getWorkTitle(work, locale)}
                  </p>
                  {work.price != null && (
                    <p className="mt-0.5 text-sm text-[#6B5C4E]">
                      {work.price.toLocaleString(locale === 'ar' ? 'ar-KW' : 'en-KW')} {locale === 'ar' ? 'د.ك' : 'KWD'}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
