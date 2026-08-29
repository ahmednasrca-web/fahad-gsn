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
    <div dir={dir}>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#E8DDD0] bg-[#FAF7F2] py-3.5">
        <div className="container-site">
          <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
            <ol className="flex items-center gap-2 text-sm text-[#6B5C4E]">
              <li>
                <Link href="/" className="hover:text-[#2C1810] transition-colors">
                  {t(locale, 'home')}
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#D4B896]">/</li>
              <li>
                <Link href="/gallery" className="hover:text-[#2C1810] transition-colors">
                  {t(locale, 'gallery')}
                </Link>
              </li>
              {work.category && (
                <>
                  <li aria-hidden="true" className="text-[#D4B896]">/</li>
                  <li>
                    <Link
                      href={`/gallery?category=${work.category.slug}`}
                      className="hover:text-[#2C1810] transition-colors"
                    >
                      {getCategoryName(work.category, locale)}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true" className="text-[#D4B896]">/</li>
              <li className="text-[#1A1209] font-medium truncate" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Work Overview */}
      <div className="section-padding">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Image gallery */}
            <div>
              <WorkImageGallery images={allImages} title={title} />
            </div>

            {/* Work details */}
            <div className="flex flex-col">
              {/* Badges: Category & 1 of 1 */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {work.category && (
                  <Link
                    href={`/gallery?category=${work.category.slug}`}
                    className="inline-flex items-center rounded-full bg-[#F0E8D8] px-3.5 py-1 text-xs font-semibold text-[#6B3F1F] transition-colors hover:bg-[#E8DDD0]"
                  >
                    {getCategoryName(work.category, locale)}
                  </Link>
                )}
                {work.isUniquePiece && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C4854A] bg-[#C4854A]/10 px-3.5 py-1 text-xs font-bold text-[#8A4F1D]">
                    <span>💎</span>
                    {locale === 'ar' ? 'قطعة فريدة حصرية (1 of 1)' : 'Exclusive Piece (1 of 1)'}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold leading-tight text-[#1A1209] md:text-4xl">
                {title}
              </h1>

              {/* Price */}
              {work.price != null && (
                <div className="mb-6 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-[#2C1810]">
                    {work.price.toLocaleString(locale === 'ar' ? 'ar-KW' : 'en-KW')}
                  </p>
                  <span className="text-base font-semibold text-[#8A7968]">
                    {locale === 'ar' ? 'د.ك' : 'KWD'}
                  </span>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="mb-8 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD0] p-5">
                  <p className="text-base leading-relaxed text-[#3D2B1A] whitespace-pre-line">
                    {description}
                  </p>
                </div>
              )}

              {/* WhatsApp CTA */}
              <div className="mt-auto">
                <WhatsAppCTA workTitle={title} locale={locale} />
              </div>

              {/* Secondary Message link */}
              <Link
                href="/contact"
                className="mt-3 flex min-h-[48px] items-center justify-center rounded-2xl border border-[#E8DDD0] text-sm font-medium text-[#6B5C4E] transition-colors hover:border-[#C4854A] hover:text-[#2C1810]"
              >
                {locale === 'ar' ? 'أو أرسل استفساراً عبر نموذج التواصل' : 'Or send an inquiry via form'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Story Behind the Craft (if available) */}
      {story && (
        <section className="border-y border-[#E8DDD0] bg-[#FAF7F2] py-16">
          <div className="container-site max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C1810] text-lg text-[#C4854A]">
                🪵
              </span>
              <div>
                <h2 className="text-2xl font-bold text-[#1A1209]">
                  {locale === 'ar' ? 'حكاية القطعة والإلهام' : 'Story Behind the Craft'}
                </h2>
                <p className="text-xs text-[#8A7968]">
                  {locale === 'ar' ? 'أصل الخشب، تفاصيل التشكيل، ولمسة الحرفي' : 'Wood origin, shaping details, and craftsman spirit'}
                </p>
              </div>
            </div>
            <div className="prose prose-stone text-base leading-loose text-[#3D2B1A] mt-6 bg-white border border-[#E8DDD0] rounded-2xl p-6 sm:p-8 shadow-xs">
              <p className="whitespace-pre-line leading-relaxed">{story}</p>
            </div>
          </div>
        </section>
      )}

      {/* Behind the Scenes Reels Carousel (if reels exist) */}
      {reels.length > 0 && (
        <section className="section-padding bg-[#2C1810] text-[#FAF7F2]">
          <div className="container-site">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C4854A]">
                  {locale === 'ar' ? 'من داخل الورشة' : 'From The Workshop'}
                </span>
                <h2 className="mt-1 text-2xl font-bold md:text-3xl text-white">
                  {locale === 'ar' ? 'كواليس التشكيل والحرفة' : 'Behind The Craft in Action'}
                </h2>
              </div>
              <Link
                href="/reels"
                className="text-sm font-semibold text-[#D4B896] hover:text-white transition-colors"
              >
                {locale === 'ar' ? 'مشاهدة كافة الريلز ←' : 'View all reels →'}
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

      {/* Related Works */}
      {relatedWorks.length > 0 && (
        <section className="section-padding bg-[#F5F0E8]">
          <div className="container-site">
            <h2 className="mb-8 text-2xl font-bold text-[#1A1209]">
              {t(locale, 'relatedWorks')}
            </h2>
            <div className="gallery-grid">
              {relatedWorks.map((related) => (
                <Link
                  key={related.id}
                  href={`/gallery/${related.slug}`}
                  className="work-card group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 border-[#E8DDD0] transition-all hover:shadow-md hover:-translate-y-1 duration-300"
                >
                  <div className="relative aspect-work-card overflow-hidden bg-[#F5F0E8]">
                    {related.primaryImage ? (
                      <Image
                        src={related.primaryImage}
                        alt={getWorkTitle(related, locale)}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="work-card-image object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl text-[#D4B896]" aria-hidden="true">🪵</span>
                      </div>
                    )}
                    {related.isUniquePiece && (
                      <span className="absolute top-2 start-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-[#C4854A] backdrop-blur-sm">
                        💎 1 of 1
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="truncate text-base font-bold text-[#1A1209]">
                      {getWorkTitle(related, locale)}
                    </p>
                    {related.price != null ? (
                      <p className="mt-1 text-sm font-semibold text-[#2C1810]">
                        {related.price.toLocaleString(locale === 'ar' ? 'ar-KW' : 'en-KW')} {locale === 'ar' ? 'د.ك' : 'KWD'}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-[#8A7968]">حسب الطلب</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
