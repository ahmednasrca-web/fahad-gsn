import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { getDir, t, getWorkTitle, getCategoryName } from '@/lib/i18n'
import { getPublishedWorks } from '@/lib/db/works'
import { getActiveCategories } from '@/lib/db/categories'
import CategoryFilter from '@/components/works/CategoryFilter'
import MuseumShowcaseModal from '@/components/gallery/MuseumShowcaseModal'

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'المعرض | فهد غصن' : 'Gallery | Fahad Gsn',
    description: locale === 'ar'
      ? 'استعرض أعمالنا الخشبية الفاخرة المصنوعة يدوياً'
      : 'Browse our luxury handcrafted wood works',
  }
}

export const dynamic = 'force-dynamic'

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
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className={`mb-2 text-[#C4854A] font-bold ${locale === 'ar' ? 'text-xs font-display' : 'text-xs uppercase tracking-[0.2em]'}`}>
            {locale === 'ar' ? 'أعمالنا والمقتنيات' : 'Our Works & Haute Collection'}
          </p>
          <h1 className="text-4xl font-bold text-[#1A1209] md:text-5xl font-display">
            {t(locale, 'gallery')}
          </h1>

          {/* Museum Mode Launch Trigger */}
          {works.length > 0 && (
            <div className="mt-5 flex justify-center">
              <MuseumShowcaseModal works={works} locale={locale} />
            </div>
          )}
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
            <p className="mt-4 text-lg font-medium text-[#3D2B1A] dark:text-[#E8DDD0]">
              {t(locale, 'noWorks')}
            </p>
          </div>
        ) : (
          <div className="gallery-grid">
            {works.map((work, i) => (
              <Link
                key={work.id}
                href={`/gallery/${work.slug}`}
                className="work-card group block overflow-hidden rounded-2xl bg-white dark:bg-[#170E09] shadow-sm ring-1 ring-[#E8DDD0] dark:ring-[#2C1B10] transition-all hover:shadow-md hover:-translate-y-1 duration-300"
              >
                {/* Image */}
                <div className="relative aspect-work-card overflow-hidden bg-[#F5F0E8] dark:bg-[#1F130B]">
                  {work.primaryImage ? (
                    <Image
                      src={work.primaryImage}
                      alt={getWorkTitle(work, locale)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="work-card-image object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={i < 4}
                      loading={i < 4 ? undefined : 'lazy'}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl text-[#D4B896]" aria-hidden="true">🪵</span>
                    </div>
                  )}

                  {/* Unique Piece Badge */}
                  {work.isUniquePiece && (
                    <span className="absolute top-2 start-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-[#C4854A] backdrop-blur-sm border border-[#C4854A]/30">
                      {locale === 'ar' ? 'قطعة فريدة حصرية' : 'Unique Piece'}
                    </span>
                  )}

                  {/* Category badge */}
                  {work.category && (
                    <span className="absolute bottom-2 start-2 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {getCategoryName(work.category, locale)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <p className="truncate text-sm font-bold text-[#1A1209] dark:text-[#FAF7F2] group-hover:text-[#C4854A] transition-colors">
                    {getWorkTitle(work, locale)}
                  </p>
                  {work.price != null && (
                    <p className="mt-1 text-sm font-semibold text-[#2C1810] dark:text-[#D4B896]">
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
