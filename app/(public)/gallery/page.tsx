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
      ? 'استعرض أعمالنا ومقتنياتنا الخشبية الفاخرة المصنوعة يدوياً'
      : 'Browse our luxury handcrafted woodwork & bespoke furniture gallery',
  }
}

export const dynamic = 'force-dynamic'

export default async function GalleryPage({ searchParams }: PageProps) {
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'
  const { category: categorySlug } = await searchParams

  const [categories, works] = await Promise.all([
    getActiveCategories(),
    getPublishedWorks(categorySlug),
  ])

  return (
    <div dir={dir} className="bg-[#fcfbf9] dark:bg-[#161412] text-[#181614] dark:text-[#fbf9f6] transition-colors duration-300">
      {/* ── Page Hero Header (Furnish Products Header) ───────────── */}
      <section className="py-12 md:py-16 bg-[#f5f3ef] dark:bg-[#1c1916] border-b border-[#e8e5df] dark:border-[#2d2822] text-center">
        <div className="container-site max-w-2xl mx-auto">
          <span className="furnish-subheading">
            {isAr ? 'الأعمال والمقتنيات' : 'Our Haute Woodwork Collection'}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#181614] dark:text-[#fbf9f6] mt-2 mb-4 font-display">
            {t(locale, 'gallery')}
          </h1>
          <p className="text-sm sm:text-base text-[#5c544a] dark:text-[#d0c9bf] leading-relaxed">
            {isAr
              ? 'كل قطعة تحفة متفردة تم نحتها وتشطيبها يدوياً من أندر أنواع الخشب الطبيعي الصلب.'
              : 'Each piece is an original sculpture, hand-shaped from rare natural timbers and finished with organic oils.'}
          </p>
        </div>
      </section>

      {/* ── Main Gallery Content ─────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          {/* Category Filter Navigation */}
          {categories.length > 0 && (
            <div className="mb-10 pb-4 border-b border-[#e8e5df] dark:border-[#2d2822]">
              <CategoryFilter
                categories={categories}
                activeSlug={categorySlug}
                locale={locale}
              />
            </div>
          )}

          {/* Works Grid */}
          {works.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-5xl mb-4" aria-hidden="true">🪵</p>
              <h3 className="text-xl font-bold text-[#181614] dark:text-[#fbf9f6]">
                {t(locale, 'noWorks')}
              </h3>
              <p className="mt-2 text-sm text-[#8a7f72] dark:text-[#a89e90]">
                {isAr ? 'يرجى اختيار تصنيف آخر أو العودة لجميع الأعمال.' : 'Please select another category or view all works.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {works.map((work, i) => (
                <div
                  key={work.id}
                  className="furnish-card group flex flex-col overflow-hidden shadow-xs"
                >
                  {/* Image Container with Furnish Aspect Ratio */}
                  <Link
                    href={`/gallery/${work.slug}`}
                    className="relative aspect-[4/5] overflow-hidden bg-[#e8e5df] dark:bg-[#23201c] block"
                  >
                    {work.primaryImage ? (
                      <Image
                        src={work.primaryImage}
                        alt={getWorkTitle(work, locale)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        priority={i < 4}
                        loading={i < 4 ? undefined : 'lazy'}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🪵
                      </div>
                    )}

                    {/* Furnish Sharp Unique Piece Badge */}
                    {work.isUniquePiece && (
                      <span className="furnish-badge absolute top-3 start-3 shadow-xs">
                        {isAr ? 'قطعة فريدة' : 'Unique Piece'}
                      </span>
                    )}

                    {/* Category Label Overlay */}
                    {work.category && (
                      <span className="absolute bottom-3 start-3 bg-black/75 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1">
                        {getCategoryName(work.category, locale)}
                      </span>
                    )}
                  </Link>

                  {/* Furnish Details */}
                  <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-[#23201c]">
                    <div>
                      <h3 className="text-base font-bold text-[#181614] dark:text-[#fbf9f6] group-hover:text-[#d47f31] transition-colors line-clamp-1">
                        <Link href={`/gallery/${work.slug}`}>
                          {getWorkTitle(work, locale)}
                        </Link>
                      </h3>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#e8e5df] dark:border-[#353029] flex items-center justify-between">
                      {work.price != null ? (
                        <span className="text-sm font-bold text-[#181614] dark:text-[#fbf9f6]">
                          {work.price.toLocaleString(isAr ? 'ar-KW' : 'en-KW')} {isAr ? 'د.ك' : 'KWD'}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#d47f31]">
                          {isAr ? 'حسب الطلب' : 'Custom Quote'}
                        </span>
                      )}

                      <Link
                        href={`/gallery/${work.slug}`}
                        className="text-xs font-bold uppercase tracking-wider text-[#5c544a] dark:text-[#d0c9bf] group-hover:text-[#d47f31] transition-colors"
                      >
                        {isAr ? 'التفاصيل ←' : 'Details →'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
