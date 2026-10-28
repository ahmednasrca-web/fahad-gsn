import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocale } from '@/lib/locale'
import { getDir, t, getWorkTitle, getWorkDescription, getCategoryName } from '@/lib/i18n'
import { getPublishedWorkBySlug, getPublishedWorks } from '@/lib/db/works'
import { getFeaturedReels } from '@/lib/db/reels'
import WorkImageGallery from '@/components/works/WorkImageGallery'
import WhatsAppCTA from '@/components/works/WhatsAppCTA'
import ReelCard from '@/components/reels/ReelCard'
import StickyVIPInquiryBar from '@/components/works/StickyVIPInquiryBar'
import { safeJsonLd } from '@/lib/json-ld'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const work = await getPublishedWorkBySlug(slug)
  if (!work) return {}

  const title = getWorkTitle(work, locale)
  const description = getWorkDescription(work, locale)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahadgsn.com'

  return {
    title,
    description: description ?? (locale === 'ar' ? 'أعمال خشبية يدوية فاخرة — فهد غصن' : 'Luxury handcrafted wood — Fahad Gsn'),
    openGraph: {
      title,
      description: description ?? undefined,
      images: work.primaryImage ? [{ url: work.primaryImage }] : [],
      type: 'website',
      url: `${siteUrl}/gallery/${slug}`,
    },
    alternates: {
      canonical: `${siteUrl}/gallery/${slug}`,
    },
  }
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'

  const work = await getPublishedWorkBySlug(slug)
  if (!work) notFound()

  // Related works
  const relatedWorks = work.category
    ? (await getPublishedWorks(work.category.slug))
        .filter((w) => w.id !== work.id)
        .slice(0, 4)
    : []

  // Behind the scenes reels
  const reels = await getFeaturedReels(3)

  const title = getWorkTitle(work, locale)
  const description = getWorkDescription(work, locale)
  const story = locale === 'ar' ? work.storyAr : (work.storyEn || work.storyAr)

  const allImages = work.images.length > 0
    ? work.images
    : work.primaryImage
      ? [work.primaryImage]
      : []

  // JSON-LD Product & Handmade Schema for Google Rich Snippets
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahadgsn.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: allImages,
    description: description || title,
    brand: {
      '@type': 'Brand',
      name: 'فهد غصن | Fahad Gsn',
    },
    offers: work.price
      ? {
          '@type': 'Offer',
          priceCurrency: 'KWD',
          price: work.price,
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/gallery/${slug}`,
        }
      : undefined,
  }

  return (
    <div dir={dir} className="bg-[#fcfbf9] dark:bg-[#161412] text-[#181614] dark:text-[#fbf9f6] transition-colors duration-300">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#e8e5df] dark:border-[#2d2822] bg-[#f5f3ef] dark:bg-[#1c1916] py-4">
        <div className="container-site">
          <nav aria-label={isAr ? 'مسار التنقل' : 'Breadcrumb'}>
            <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5c544a] dark:text-[#d0c9bf]">
              <li>
                <Link href="/" className="hover:text-[#d47f31] transition-colors">
                  {t(locale, 'home')}
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#8a7f72] dark:text-[#5c544a]">/</li>
              <li>
                <Link href="/gallery" className="hover:text-[#d47f31] transition-colors">
                  {t(locale, 'gallery')}
                </Link>
              </li>
              {work.category && (
                <>
                  <li aria-hidden="true" className="text-[#8a7f72] dark:text-[#5c544a]">/</li>
                  <li>
                    <Link
                      href={`/gallery?category=${work.category.slug}`}
                      className="hover:text-[#d47f31] transition-colors"
                    >
                      {getCategoryName(work.category, locale)}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true" className="text-[#8a7f72] dark:text-[#5c544a]">/</li>
              <li className="text-[#181614] dark:text-[#fbf9f6] font-bold truncate" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Work Overview */}
      <div className="py-12 md:py-16">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Image Gallery */}
            <div>
              <WorkImageGallery images={allImages} title={title} locale={locale} />
            </div>

            {/* Work Details & Specifications */}
            <div className="flex flex-col">
              {/* Badges: Category & Unique Piece */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {work.category && (
                  <Link
                    href={`/gallery?category=${work.category.slug}`}
                    className="furnish-badge border border-[#e8e5df] dark:border-[#353029] hover:border-[#d47f31] transition-colors"
                  >
                    {getCategoryName(work.category, locale)}
                  </Link>
                )}
                {work.isUniquePiece && (
                  <span className="furnish-badge border border-[#d47f31]/40 bg-[#d47f31]/10 text-[#d47f31]">
                    {isAr ? 'قطعة فريدة حصرية' : 'Exclusive Unique Piece'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-normal leading-tight text-[#181614] dark:text-[#fbf9f6] md:text-4xl lg:text-5xl font-display">
                {title}
              </h1>

              {/* Price */}
              {work.price != null ? (
                <div className="mb-6 flex items-baseline gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-[#181614] dark:text-[#fbf9f6] font-mono">
                    {work.price.toLocaleString(isAr ? 'ar-KW' : 'en-KW')}
                  </p>
                  <span className="text-base font-bold text-[#d47f31]">
                    {isAr ? 'د.ك' : 'KWD'}
                  </span>
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#d47f31]">
                    {isAr ? 'السعر حسب الطلب والمواصفات' : 'Custom Pricing on Commission'}
                  </span>
                </div>
              )}

              {/* Description */}
              {description && (
                <p className="mb-8 text-base leading-relaxed text-[#5c544a] dark:text-[#d0c9bf]">
                  {description}
                </p>
              )}

              {/* Physical Specs Matrix (Furnish Architectural Grid) */}
              {work.physicalSpecs && (
                <div className="mb-8 border border-[#e8e5df] dark:border-[#2d2822] bg-[#f5f3ef] dark:bg-[#1c1916] p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#181614] dark:text-[#fbf9f6] mb-4">
                    {isAr ? 'المواصفات الهندسية والفيزيائية' : 'Architectural Specifications'}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {work.physicalSpecs.lengthCm && work.physicalSpecs.widthCm && (
                      <div className="bg-white dark:bg-[#23201c] p-3 border border-[#e8e5df] dark:border-[#353029]">
                        <span className="text-[#8a7f72] dark:text-[#a89e90] block text-[10px] uppercase tracking-wider mb-1">
                          {isAr ? 'الأبعاد' : 'Dimensions'}
                        </span>
                        <span className="font-mono font-bold text-[#181614] dark:text-[#fbf9f6]">
                          {work.physicalSpecs.lengthCm} × {work.physicalSpecs.widthCm} {work.physicalSpecs.heightCm ? `× ${work.physicalSpecs.heightCm}` : ''} cm
                        </span>
                      </div>
                    )}
                    {work.physicalSpecs.thicknessMm && (
                      <div className="bg-white dark:bg-[#23201c] p-3 border border-[#e8e5df] dark:border-[#353029]">
                        <span className="text-[#8a7f72] dark:text-[#a89e90] block text-[10px] uppercase tracking-wider mb-1">
                          {isAr ? 'سُمك اللوح' : 'Slab Thickness'}
                        </span>
                        <span className="font-mono font-bold text-[#181614] dark:text-[#fbf9f6]">
                          {work.physicalSpecs.thicknessMm} mm Solid
                        </span>
                      </div>
                    )}
                    {work.physicalSpecs.weightKg && (
                      <div className="bg-white dark:bg-[#23201c] p-3 border border-[#e8e5df] dark:border-[#353029]">
                        <span className="text-[#8a7f72] dark:text-[#a89e90] block text-[10px] uppercase tracking-wider mb-1">
                          {isAr ? 'الوزن التقريبي' : 'Weight'}
                        </span>
                        <span className="font-mono font-bold text-[#181614] dark:text-[#fbf9f6]">
                          ~{work.physicalSpecs.weightKg} kg
                        </span>
                      </div>
                    )}
                    <div className="bg-white dark:bg-[#23201c] p-3 border border-[#e8e5df] dark:border-[#353029]">
                      <span className="text-[#8a7f72] dark:text-[#a89e90] block text-[10px] uppercase tracking-wider mb-1">
                        {isAr ? 'التشطيب والزيوت' : 'Finishing Oils'}
                      </span>
                      <span className="font-bold text-[#181614] dark:text-[#fbf9f6] truncate block">
                        {isAr ? (work.physicalSpecs.finishDetailsAr || 'زيوت نباتية عضوية + شمع نحل') : (work.physicalSpecs.finishDetailsEn || 'Organic Oils + Beeswax')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mt-auto">
                <WhatsAppCTA workTitle={title} locale={locale} />
                <Link
                  href="/contact"
                  className="btn-furnish-outline w-full text-center block"
                >
                  {isAr ? 'طلب استشارة مخصصة للقطعة' : 'Inquire via Direct Form'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Behind the Craft (Furnish Editorial) */}
      {story && (
        <section className="border-y border-[#e8e5df] dark:border-[#2d2822] bg-[#f5f3ef] dark:bg-[#1c1916] py-16">
          <div className="container-site max-w-3xl">
            <span className="furnish-subheading">
              {isAr ? 'حكاية العمل' : 'The Atelier Story'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#181614] dark:text-[#fbf9f6] mt-1 mb-6 font-display">
              {isAr ? 'أصل الخشب، تفاصيل التشكيل، ولمسة الحرفي' : 'Wood Origin & Artisan Process'}
            </h2>
            <div className="bg-white dark:bg-[#23201c] border border-[#e8e5df] dark:border-[#353029] p-6 sm:p-8">
              <p className="whitespace-pre-line leading-relaxed text-[#5c544a] dark:text-[#d0c9bf] text-base">
                {story}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Behind the Scenes Reels (if reels exist) */}
      {reels.length > 0 && (
        <section className="py-16 md:py-20 bg-[#1c1916] text-[#fbf9f6] border-b border-[#2d2822]">
          <div className="container-site">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="furnish-subheading text-[#d47f31]">
                  {isAr ? 'من داخل الورشة' : 'Behind The Scenes'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#fbf9f6] mt-1 font-display">
                  {isAr ? 'كواليس التشكيل والحرفة' : 'Craft in Motion'}
                </h2>
              </div>
              <Link
                href="/reels"
                className="text-xs font-bold uppercase tracking-wider text-[#d47f31] hover:underline"
              >
                {isAr ? 'مشاهدة كافة المقاطع ←' : 'View all reels →'}
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Works (Furnish Product Grid) */}
      {relatedWorks.length > 0 && (
        <section className="py-16 md:py-20 bg-[#fcfbf9] dark:bg-[#161412]">
          <div className="container-site">
            <div className="mb-8">
              <span className="furnish-subheading">
                {isAr ? 'مقتنيات مشابهة' : 'Curated Recommendations'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#181614] dark:text-[#fbf9f6] mt-1 font-display">
                {t(locale, 'relatedWorks')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedWorks.map((related) => (
                <div
                  key={related.id}
                  className="furnish-card group flex flex-col overflow-hidden"
                >
                  <Link
                    href={`/gallery/${related.slug}`}
                    className="relative aspect-[4/5] overflow-hidden bg-[#e8e5df] dark:bg-[#23201c] block"
                  >
                    {related.primaryImage ? (
                      <Image
                        src={related.primaryImage}
                        alt={getWorkTitle(related, locale)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🪵
                      </div>
                    )}
                    {related.isUniquePiece && (
                      <span className="furnish-badge absolute top-3 start-3">
                        {isAr ? 'قطعة فريدة' : 'Unique Piece'}
                      </span>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-[#23201c]">
                    <h3 className="text-sm font-bold text-[#181614] dark:text-[#fbf9f6] group-hover:text-[#d47f31] transition-colors line-clamp-1">
                      <Link href={`/gallery/${related.slug}`}>
                        {getWorkTitle(related, locale)}
                      </Link>
                    </h3>

                    <div className="mt-3 pt-2.5 border-t border-[#e8e5df] dark:border-[#353029] flex items-center justify-between">
                      {related.price != null ? (
                        <span className="text-xs font-bold text-[#181614] dark:text-[#fbf9f6]">
                          {related.price.toLocaleString(isAr ? 'ar-KW' : 'en-KW')} {isAr ? 'د.ك' : 'KWD'}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold uppercase text-[#d47f31]">
                          {isAr ? 'حسب الطلب' : 'Custom'}
                        </span>
                      )}

                      <Link
                        href={`/gallery/${related.slug}`}
                        className="text-[11px] font-bold uppercase text-[#5c544a] dark:text-[#d0c9bf] group-hover:text-[#d47f31]"
                      >
                        {isAr ? 'التفاصيل ←' : 'Details →'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky VIP Inquiry & Share Bar */}
      <StickyVIPInquiryBar work={work} locale={locale} />
    </div>
  )
}
