import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLocale } from '@/lib/locale'
import { getDir, t, getWorkTitle, getWorkDescription, getCategoryName } from '@/lib/i18n'
import { getPublishedWorkBySlug, getAllPublishedWorkSlugs, getPublishedWorks } from '@/lib/db/works'
import WorkImageGallery from '@/components/works/WorkImageGallery'
import WhatsAppCTA from '@/components/works/WhatsAppCTA'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  // Skip static generation if Supabase is not configured (e.g. CI/local build without .env)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const slugs = await getAllPublishedWorkSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

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
    description: description ?? (locale === 'ar' ? 'عمل خشبي يدوي فاخر' : 'Luxury handcrafted wood work'),
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

  // Related works (same category, exclude current)
  const relatedWorks = work.category
    ? (await getPublishedWorks(work.category.slug))
        .filter((w) => w.id !== work.id)
        .slice(0, 4)
    : []

  const title = getWorkTitle(work, locale)
  const description = getWorkDescription(work, locale)
  const allImages = work.images.length > 0
    ? work.images
    : work.primaryImage
      ? [work.primaryImage]
      : []

  return (
    <div dir={dir}>
      {/* Breadcrumb */}
      <div className="border-b border-[#E8DDD0] bg-[#FAF7F2] py-3">
        <div className="container-site">
          <nav aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
            <ol className="flex items-center gap-2 text-sm text-[#6B5C4E]">
              <li>
                <Link href="/" className="hover:text-[#2C1810]">
                  {t(locale, 'home')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/gallery" className="hover:text-[#2C1810]">
                  {t(locale, 'gallery')}
                </Link>
              </li>
              {work.category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/gallery?category=${work.category.slug}`}
                      className="hover:text-[#2C1810]"
                    >
                      {getCategoryName(work.category, locale)}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-[#1A1209] font-medium" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="section-padding">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left: Image gallery */}
            <div>
              <WorkImageGallery images={allImages} title={title} />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              {/* Category */}
              {work.category && (
                <Link
                  href={`/gallery?category=${work.category.slug}`}
                  className="mb-4 inline-flex w-fit items-center rounded-full bg-[#F0E8D8] px-3 py-1 text-xs font-semibold text-[#6B3F1F] transition-colors hover:bg-[#E8DDD0]"
                >
                  {getCategoryName(work.category, locale)}
                </Link>
              )}

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold leading-tight text-[#1A1209] md:text-4xl">
                {title}
              </h1>

              {/* Price */}
              {work.price != null && (
                <div className="mb-6">
                  <p className="text-2xl font-bold text-[#2C1810]">
                    {work.price.toLocaleString(locale === 'ar' ? 'ar-KW' : 'en-KW')}
                    <span className="ms-2 text-lg font-medium text-[#6B5C4E]">
                      {locale === 'ar' ? 'د.ك' : 'KWD'}
                    </span>
                  </p>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="mb-8">
                  <p className="text-base leading-relaxed text-[#3D2B1A]">
                    {description}
                  </p>
                </div>
              )}

              {/* WhatsApp CTA */}
              <div className="mt-auto">
                <WhatsAppCTA
                  workTitle={title}
                  locale={locale}
                />
              </div>

              {/* Contact link */}
              <Link
                href="/contact"
                className="mt-4 flex min-h-[48px] items-center justify-center rounded-2xl border border-[#E8DDD0] text-sm font-medium text-[#6B5C4E] transition-colors hover:border-[#C4854A] hover:text-[#2C1810]"
              >
                {locale === 'ar' ? 'أو أرسل رسالة' : 'Or send a message'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related works */}
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
                  className="work-card group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E8DDD0] transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-work-card overflow-hidden bg-[#F5F0E8]">
                    {related.primaryImage ? (
                      <Image
                        src={related.primaryImage}
                        alt={getWorkTitle(related, locale)}
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
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-[#1A1209]">
                      {getWorkTitle(related, locale)}
                    </p>
                    {related.price != null && (
                      <p className="mt-0.5 text-sm text-[#6B5C4E]">
                        {related.price.toLocaleString(locale === 'ar' ? 'ar-KW' : 'en-KW')} {locale === 'ar' ? 'د.ك' : 'KWD'}
                      </p>
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
