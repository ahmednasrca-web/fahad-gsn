import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { getDir, getWorkTitle, getContentValue } from '@/lib/i18n'
import { getFeaturedWorks } from '@/lib/db/works'
import { getSiteContent } from '@/lib/db/content'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'الرئيسية | فهد غصن' : 'Home | Fahad Gsn',
    description: locale === 'ar'
      ? 'أعمال خشبية يدوية فاخرة — فهد غصن، الكويت'
      : 'Luxury handcrafted wood — Fahad Gsn, Kuwait',
  }
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const [featuredWorks, content] = await Promise.all([
    getFeaturedWorks(6),
    getSiteContent(),
  ])

  const heroTitle = getContentValue(content['hero_title'] ?? {}, locale)
    ?? (locale === 'ar' ? 'فهد غصن' : 'Fahad Gsn')
  const heroSubtitle = getContentValue(content['hero_subtitle'] ?? {}, locale)
    ?? (locale === 'ar' ? 'أعمال خشبية يدوية فاخرة' : 'Luxury Handcrafted Wood')

  return (
    <div dir={dir}>
      {/* ── Hero Section ─────────────────────────────────── */}
      <section
        className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden bg-[#2C1810] text-center"
        aria-label={locale === 'ar' ? 'القسم الرئيسي' : 'Hero section'}
      >
        {/* Warm gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(196,133,74,0.12) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle texture lines — decorative */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #C4854A 0px, #C4854A 1px, transparent 1px, transparent 60px)',
          }}
          aria-hidden="true"
        />

        <div className="container-site relative z-10">
          {/* Eyebrow */}
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#C4854A]">
            {locale === 'ar' ? 'صنع بيد كويتية' : 'Handcrafted in Kuwait'}
          </p>

          {/* Main Headline */}
          <h1
            className="mb-6 text-5xl font-bold leading-tight text-[#FAF7F2] md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--font-playfair), var(--font-noto-naskh), serif' }}
          >
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-md text-lg text-[#D4B896] md:text-xl">
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/gallery"
              className="flex min-h-[52px] items-center rounded-full bg-[#C4854A] px-8 font-semibold text-[#FAF7F2] transition-opacity hover:opacity-90 active:opacity-75"
            >
              {locale === 'ar' ? 'استعرض الأعمال' : 'View Works'}
            </Link>
            <Link
              href="/contact"
              className="flex min-h-[52px] items-center rounded-full border border-[#C4854A]/50 px-8 font-medium text-[#D4B896] transition-colors hover:border-[#C4854A] hover:text-[#FAF7F2]"
            >
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="h-12 w-px bg-gradient-to-b from-transparent to-[#C4854A]/60" />
        </div>
      </section>

      {/* ── Featured Works Section ───────────────────────── */}
      {featuredWorks.length > 0 && (
        <section className="section-padding bg-[#FAF7F2]">
          <div className="container-site">
            {/* Section header */}
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4854A]">
                  {locale === 'ar' ? 'من أعمالنا' : 'Our Works'}
                </p>
                <h2 className="text-3xl font-bold text-[#1A1209] md:text-4xl">
                  {locale === 'ar' ? 'أعمال مميزة' : 'Featured Works'}
                </h2>
              </div>
              <Link
                href="/gallery"
                className="hidden text-sm font-medium text-[#6B3F1F] underline-offset-4 hover:underline md:block"
              >
                {locale === 'ar' ? 'عرض الكل ←' : '→ View All'}
              </Link>
            </div>

            {/* Works grid */}
            <div className="gallery-grid">
              {featuredWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/gallery/${work.slug}`}
                  className="work-card group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E8DDD0] transition-all hover:shadow-md hover:-translate-y-1 duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-work-card overflow-hidden bg-[#F5F0E8]">
                    {work.primaryImage ? (
                      <Image
                        src={work.primaryImage}
                        alt={getWorkTitle(work, locale)}
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
                    {work.isUniquePiece && (
                      <span className="absolute top-2 start-2 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-[#C4854A] backdrop-blur-sm border border-[#C4854A]/30">
                        💎 1 of 1
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <p className="truncate text-sm font-bold text-[#1A1209] group-hover:text-[#C4854A] transition-colors">
                      {getWorkTitle(work, locale)}
                    </p>
                    {work.price != null && (
                      <p className="mt-1 text-sm font-semibold text-[#2C1810]">
                        {work.price.toLocaleString(locale === 'ar' ? 'ar-KW' : 'en-KW')} {locale === 'ar' ? 'د.ك' : 'KWD'}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile "View All" link */}
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/gallery"
                className="inline-flex min-h-[48px] items-center rounded-full border border-[#C4854A] px-8 text-sm font-semibold text-[#6B3F1F] transition-colors hover:bg-[#C4854A] hover:text-white"
              >
                {locale === 'ar' ? 'عرض جميع الأعمال' : 'View All Works'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── About Teaser Section ─────────────────────────── */}
      <section className="section-padding bg-[#F0E8D8]">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#A0522D]">
              {locale === 'ar' ? 'من نحن' : 'About'}
            </p>
            <h2 className="mb-6 text-3xl font-bold text-[#1A1209] md:text-4xl">
              {locale === 'ar' ? 'حرفة يدوية بروح كويتية' : 'Handcraft with Kuwaiti Spirit'}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-[#3D2B1A]">
              {locale === 'ar'
                ? 'كل قطعة تحكي قصة. نعمل بشغف على تحويل أجود أنواع الخشب إلى أعمال فنية تدوم للأجيال.'
                : 'Every piece tells a story. We craft with passion, turning the finest wood into timeless artworks.'}
            </p>
            <Link
              href="/about"
              className="inline-flex min-h-[48px] items-center rounded-full bg-[#2C1810] px-8 font-semibold text-[#FAF7F2] transition-opacity hover:opacity-90"
            >
              {locale === 'ar' ? 'اعرف أكثر' : 'Learn More'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact CTA Section ──────────────────────────── */}
      <section className="section-padding bg-[#2C1810]">
        <div className="container-site text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#FAF7F2] md:text-4xl">
            {locale === 'ar' ? 'لديك فكرة؟ تحدّث معنا' : 'Have an idea? Talk to us'}
          </h2>
          <p className="mb-8 text-[#D4B896]">
            {locale === 'ar'
              ? 'نقوم بتنفيذ الطلبات المخصصة ونسعد بتحويل أفكارك إلى واقع'
              : 'We take custom orders and love turning your ideas into reality'}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '96598908022'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#25D366] px-8 font-semibold text-white transition-opacity hover:opacity-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="flex min-h-[52px] items-center rounded-full border border-[#C4854A]/50 px-8 font-medium text-[#D4B896] transition-colors hover:border-[#C4854A] hover:text-[#FAF7F2]"
            >
              {locale === 'ar' ? 'نموذج التواصل' : 'Contact Form'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
