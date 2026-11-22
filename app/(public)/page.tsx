import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { getDir, getWorkTitle, getContentValue } from '@/lib/i18n'
import { getFeaturedWorks } from '@/lib/db/works'
import { getSiteContent } from '@/lib/db/content'
import { safeJsonLd } from '@/lib/json-ld'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahadgsn.com'
  const title = locale === 'ar' ? 'الرئيسية | فهد غصن للأعمال الخشبية الفاخرة' : 'Home | Fahad Gsn — Luxury Handcrafted Wood'
  const description = locale === 'ar'
    ? 'أعمال خشبية يدوية فاخرة وأثاث مخصص ومقتنيات فنية نادرة في الكويت — فهد غصن'
    : 'Luxury handcrafted wood, bespoke furniture, and collectible sculptures — Fahad Gsn, Kuwait'

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}`,
      siteName: 'فهد غصن | Fahad Gsn',
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/logo-full.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo-full.png'],
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'

  const [featuredWorks, content] = await Promise.all([
    getFeaturedWorks(6),
    getSiteContent(),
  ])

  const heroTitle = getContentValue(content['hero_title'] ?? {}, locale)
    ?? (isAr ? 'فهد غصن للأعمال الخشبية' : 'Fahad Gsn Atelier')
  const heroSubtitle = getContentValue(content['hero_subtitle'] ?? {}, locale)
    ?? (isAr ? 'أعمال خشبية يدوية فاخرة وتصاميم مخصصة تدوم للأجيال' : 'Luxury handcrafted furniture & bespoke wood sculptures')

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '96598908022'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahadgsn.com'

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: isAr ? 'فهد غصن للأعمال الخشبية الفاخرة' : 'Fahad Gsn Atelier',
        description: isAr
          ? 'أعمال خشبية يدوية فاخرة وأثاث مخصص ومقتنيات فنية نادرة في الكويت'
          : 'Luxury handcrafted wood, bespoke furniture, and collectible sculptures in Kuwait',
        inLanguage: locale === 'ar' ? 'ar-KW' : 'en-US',
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'فهد غصن | Fahad Gsn',
        url: siteUrl,
        logo: `${siteUrl}/logo-full.png`,
        image: `${siteUrl}/furnish/about.jpg`,
        description: isAr
          ? 'مشغل كويتي متخصص في الأعمال الخشبية اليدوية الفاخرة والأثاث المخصص'
          : 'Kuwaiti atelier specializing in luxury handcrafted wood and bespoke furniture',
        telephone: '+96598908022',
        email: 'info@fahadgsn.com',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KW',
          addressLocality: 'Kuwait City',
        },
      },
    ],
  }

  return (
    <div dir={dir} className="bg-[#fcfbf9] dark:bg-[#161412] text-[#181614] dark:text-[#fbf9f6] transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeJsonLd) }}
      />
      {/* ── 1. Hero Section (Furnish High-Impact Architectural Showcase) ── */}
      <section
        className="relative flex min-h-[85svh] md:min-h-[90svh] flex-col items-center justify-center overflow-hidden bg-[#1c1916] text-center"
        aria-label={isAr ? 'القسم الرئيسي' : 'Hero section'}
      >
        {/* Crisp, Featherlight Optimized Background Image */}
        <Image
          src="/furnish/about.jpg"
          alt={isAr ? 'فهد غصن للأعمال الخشبية' : 'Fahad Gsn Atelier'}
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover opacity-35 select-none"
        />

        {/* Architectural Warm Gradient Overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-[#1c1916]"
          aria-hidden="true"
        />

        <div className="container-site relative z-10 py-16">
          {/* Furnish Signature Italic Eyebrow */}
          <p className="furnish-subheading mb-4 inline-block text-sm sm:text-base font-serif italic text-[#d47f31]">
            {isAr ? 'حرفة يدوية بروح كويتية' : 'Handcrafted in Kuwait • Bespoke Atelier'}
          </p>

          {/* Main Headline — Clean Grand Typography */}
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.08] tracking-tight text-[#fbf9f6] font-display">
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-[#e0dad0]">
            {heroSubtitle}
          </p>

          {/* Furnish Architectural CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gallery"
              className="btn-furnish-primary min-w-[200px]"
            >
              {isAr ? 'استعرض المعرض' : 'Explore Collection'}
            </Link>
            <Link
              href="/contact"
              className="btn-furnish-outline min-w-[200px] border-white text-white hover:bg-white hover:text-black"
            >
              {isAr ? 'طلب تصميم خاص' : 'Commission Piece'}
            </Link>
          </div>
        </div>

        {/* Minimalist Scroll Down Marker */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" aria-hidden="true">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#d47f31]">
            {isAr ? 'التفاصيل' : 'Scroll'}
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-[#d47f31] to-transparent" />
        </div>
      </section>

      {/* ── 2. "Our Favorite Collection" / Featured Works ──────────────── */}
      {featuredWorks.length > 0 && (
        <section className="py-16 md:py-24 bg-[#f5f3ef] dark:bg-[#1c1916] border-b border-[#e8e5df] dark:border-[#2d2822]">
          <div className="container-site">
            {/* Furnish Editorial Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-2xl">
                <span className="furnish-subheading">
                  {isAr ? 'المجموعة المختارة' : 'Our Favorite Collection'}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#181614] dark:text-[#fbf9f6] mt-2 mb-3">
                  {isAr ? 'أعمال استثنائية من الورشة' : 'Signature Studio Works'}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[#5c544a] dark:text-[#d0c9bf]">
                  {isAr
                    ? 'نستلهم إبداعنا من أصالة الخشب الطبيعي لنبتكر قطعاً تدمج الفخامة الهندسية بالوظيفة الحياتية وتدوم لأجيال.'
                    : 'Inspired by the enduring soul of raw timber, crafted to merge refined architectural form with living function.'}
                </p>
              </div>

              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#181614] dark:text-[#fbf9f6] hover:text-[#d47f31] dark:hover:text-[#d47f31] transition-colors pb-1 border-b border-[#181614] dark:border-[#fbf9f6] hover:border-[#d47f31] self-start md:self-end"
              >
                <span>{isAr ? 'عرض جميع الأعمال' : 'View All Works'}</span>
                <span aria-hidden="true">{isAr ? '←' : '→'}</span>
              </Link>
            </div>

            {/* Furnish Product Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredWorks.map((work, i) => (
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        priority={i < 3}
                        loading={i < 3 ? undefined : 'lazy'}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🪵
                      </div>
                    )}

                    {/* Furnish Sharp Badge */}
                    {work.isUniquePiece && (
                      <span className="furnish-badge absolute top-3 start-3 shadow-xs">
                        {isAr ? 'قطعة فريدة' : 'Unique Piece'}
                      </span>
                    )}
                  </Link>

                  {/* Furnish Product Card Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between bg-white dark:bg-[#23201c]">
                    <div>
                      {/* Subtle Category / Specie */}
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8a7f72] dark:text-[#a89e90] mb-1.5">
                        {work.category
                          ? (isAr ? work.category.nameAr : work.category.nameEn)
                          : (isAr ? 'قطعة خشبية فاخرة' : 'Fine Woodwork')}
                      </p>

                      {/* Work Title */}
                      <h3 className="text-base sm:text-lg font-bold text-[#181614] dark:text-[#fbf9f6] group-hover:text-[#d47f31] transition-colors line-clamp-1">
                        <Link href={`/gallery/${work.slug}`}>
                          {getWorkTitle(work, locale)}
                        </Link>
                      </h3>
                    </div>

                    {/* Price & Action Row */}
                    <div className="mt-4 pt-3 border-t border-[#e8e5df] dark:border-[#353029] flex items-center justify-between">
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
          </div>
        </section>
      )}

      {/* ── 3. Split Mission & Atelier Craftsmanship ──────────────────── */}
      <section className="py-16 md:py-24 bg-[#fcfbf9] dark:bg-[#161412] border-b border-[#e8e5df] dark:border-[#2d2822]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left/Start Column: High-Resolution Atelier Image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square overflow-hidden furnish-card shadow-sm">
              <Image
                src="/furnish/about.jpg"
                alt={isAr ? 'ورشة فهد غصن' : 'Fahad Gsn Atelier'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>

            {/* Right/End Column: Furnish Mission & Values */}
            <div className="flex flex-col justify-center">
              <span className="furnish-subheading">
                {isAr ? 'رسالتنا وهويتنا' : 'Our Studio Mission'}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#181614] dark:text-[#fbf9f6] mt-2 mb-6">
                {isAr ? 'شغف يجمع الفخامة المعمارية بصلابة الطبيعة' : 'Timeless Elegance Carved in Living Wood'}
              </h2>
              <p className="text-base leading-relaxed text-[#5c544a] dark:text-[#d0c9bf] mb-4">
                {isAr
                  ? 'في ورشة فهد غصن، نؤمن بأن كل قطعة خشب تحمل في عروقها روحاً خاصة. نختار أندر الأخشاب العالمية (الجوز، الزيتون، التيك، والسنديان) لنصيغ منها تحفاً وأثاثاً يجمع بين الفخامة المعاصرة والهندسة المتوازنة.'
                  : 'At Fahad Gsn Atelier, every grain of timber tells a story. We curate the finest hardwoods from around the world, transforming raw organic textures into contemporary architectural statements.'}
              </p>
              <p className="text-base leading-relaxed text-[#5c544a] dark:text-[#d0c9bf] mb-8">
                {isAr
                  ? 'لا نتبع الإنتاج التجاري المتكرر، بل نبتكر لكل عميل عملاً متفرداً ينبض بالحياة، مشبعاً بالزيوت الطبيعية التي تحميه لعقود قادمة.'
                  : 'We eschew mass manufacturing in favor of bespoke craftsmanship, ensuring each sculpture is finished with natural botanical oils that deepen with age.'}
              </p>

              {/* Three Core Values Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-[#f5f3ef] dark:bg-[#23201c] border border-[#e8e5df] dark:border-[#353029]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#181614] dark:text-[#fbf9f6] mb-1">
                    {isAr ? 'أخشاب نادرة' : 'Rare Hardwoods'}
                  </h3>
                  <p className="text-xs text-[#8a7f72] dark:text-[#a89e90]">
                    {isAr ? 'انتقاء يدوي دقيق لأجود الجذوع' : 'Hand-selected uncompromised logs'}
                  </p>
                </div>

                <div className="p-4 bg-[#f5f3ef] dark:bg-[#23201c] border border-[#e8e5df] dark:border-[#353029]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#181614] dark:text-[#fbf9f6] mb-1">
                    {isAr ? 'حرفة يدوية' : 'Artisanal Build'}
                  </h3>
                  <p className="text-xs text-[#8a7f72] dark:text-[#a89e90]">
                    {isAr ? 'نحت وتشطيب بدون تنازلات' : 'Zero compromises on joinery'}
                  </p>
                </div>

                <div className="p-4 bg-[#f5f3ef] dark:bg-[#23201c] border border-[#e8e5df] dark:border-[#353029]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#181614] dark:text-[#fbf9f6] mb-1">
                    {isAr ? 'استدامة تدوم' : 'Generations'}
                  </h3>
                  <p className="text-xs text-[#8a7f72] dark:text-[#a89e90]">
                    {isAr ? 'قطع تتوارثها الأجيال' : 'Made to outlive generations'}
                  </p>
                </div>
              </div>

              <div>
                <Link href="/about" className="btn-furnish-outline">
                  {isAr ? 'تعرف على فلسفتنا ←' : 'Read Our Philosophy →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Furnish Testimonial Feature Card (Warm, Elegant & Fully Legible) ── */}
      <section className="py-20 lg:py-28 bg-[#f5f3ef] dark:bg-[#1c1916] border-b border-[#e8e5df] dark:border-[#2d2822] text-center">
        <div className="container-site max-w-3xl">
          <div className="furnish-card p-8 sm:p-14 text-center shadow-lg bg-white dark:bg-[#23201c] border border-[#e8e5df] dark:border-[#353029]">
            {/* Quote Mark */}
            <span className="text-5xl font-serif text-[#d47f31] leading-none mb-4 block" aria-hidden="true">
              “
            </span>

            <p className="font-serif italic text-lg sm:text-2xl leading-relaxed text-[#181614] dark:text-[#fbf9f6] mb-6 font-medium">
              {isAr
                ? 'القطعة الخشبية التي تقتنيها من ورشتنا ليست مجرد أثاث أو تحفة، بل هي هوية وتاريخ يُحفر في الخشب الطبيعي ليبقى أثراً خالداً في مساحتك.'
                : 'A bespoke piece from our atelier is never merely furniture; it is an enduring identity sculpted into organic timber to elevate your living space.'}
            </p>

            <div className="pt-5 border-t border-[#e8e5df] dark:border-[#353029]">
              <p className="text-base font-bold text-[#181614] dark:text-[#fbf9f6]">
                {isAr ? 'فهد غصن' : 'Fahad Gsn'}
              </p>
              <p className="text-xs uppercase tracking-widest text-[#d47f31] font-semibold mt-1">
                {isAr ? 'المؤسس والحرفي الكويتي' : 'Founder & Master Craftsman — Kuwait'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Minimalist Custom Inquiry Section (Bright, Clear & High Contrast) ── */}
      <section className="py-16 md:py-24 bg-[#fcfbf9] dark:bg-[#161412]">
        <div className="container-site max-w-2xl text-center">
          <span className="furnish-subheading">
            {isAr ? 'استشارات وتنفيذ خاص' : 'Bespoke Commissions'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#181614] dark:text-[#fbf9f6] mt-2 mb-4 font-display">
            {isAr ? 'لديك فكرة أو مشروع خاص؟' : 'Have a Custom Vision in Mind?'}
          </h2>
          <p className="text-base leading-relaxed text-[#4a443c] dark:text-[#d0c9bf] mb-8">
            {isAr
              ? 'نقوم بتنفيذ التصاميم الاستثنائية للقصور والفلل والمساحات الراقية. تواصل معنا لمناقشة مقاسات ونوع الخشب المناسب لرؤيتك.'
              : 'We craft bespoke woodwork for fine residences and architectural spaces. Reach out to discuss dimensions, timber species, and custom tailoring.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[3rem] min-w-[220px] items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 text-sm font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>{isAr ? 'مراسلة عبر واتساب' : 'WhatsApp Inquiry'}</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-[3rem] min-w-[220px] items-center justify-center border-2 border-[#181614] dark:border-[#d47f31] text-[#181614] dark:text-[#d47f31] hover:bg-[#181614] hover:text-white dark:hover:bg-[#d47f31] dark:hover:text-white px-8 text-sm font-bold uppercase tracking-wider transition-all"
            >
              {isAr ? 'تعبئة نموذج التواصل' : 'Direct Contact Form'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
