import type { Metadata } from 'next'
import { getLocale } from '@/lib/locale'
import { getDir } from '@/lib/i18n'
import PrivateAtelierBookingModal from '@/components/concierge/PrivateAtelierBookingModal'
import GoldenRatioCalculator from '@/components/interactive/GoldenRatioCalculator'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahadgsn.com'
  const title = locale === 'ar' ? 'حجز زيارة خاصة للمشغل | فهد غصن' : 'Private Atelier Visit & Concierge | Fahad Gsn'
  const description = locale === 'ar'
    ? 'احجز جلسة استشارة حصرية في مشغل فهد غصن لمعاينة الأخشاب النادرة ومناقشة تفصيل وتصميم قطعتك الفنية الفريدة في الكويت'
    : 'Book an exclusive private consultation at the Fahad Gsn atelier to inspect rare timber slabs and commission your bespoke piece in Kuwait'

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/concierge`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/concierge`,
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

export default async function ConciergePage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'

  return (
    <div className="bg-[#fcfbf9] dark:bg-[#161412] text-[#181614] dark:text-[#fbf9f6] transition-colors duration-300" dir={dir}>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[#f5f3ef] dark:bg-[#1c1916] border-b border-[#e8e5df] dark:border-[#2d2822] text-center">
        <div className="container-site max-w-2xl mx-auto">
          <span className="furnish-subheading">
            {isAr ? 'تجربة حصرية لكبار الشخصيات' : 'VIP Concierge & Atelier Experience'}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#181614] dark:text-[#fbf9f6] mt-2 mb-4 font-display">
            {isAr ? 'زيارة خاصة لورشة فهد غصن' : 'Private Atelier Visit'}
          </h1>
          <p className="text-sm sm:text-base text-[#5c544a] dark:text-[#d0c9bf] leading-relaxed">
            {isAr
              ? 'نرحب بكم في زيارة خاصة للمشغل لمعاينة ألواح الأخشاب المعمرة النادرة، فحص نقاء العروق المجهرية، ومناقشة تصميم قطعتكم الفريدة مباشرة مع الحرفي فهد غصن.'
              : 'Experience a private walkthrough of our Kuwait atelier. Inspect rare aged timber slabs and discuss bespoke commissions directly with artisan Fahad Gsn.'}
          </p>

          <div className="mt-8 flex justify-center">
            <PrivateAtelierBookingModal
              locale={locale}
              buttonClassName="btn-furnish-primary"
            />
          </div>
        </div>
      </section>

      {/* ── Golden Ratio Proportions Tool ───────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container-site">
          <div className="furnish-card p-6 sm:p-8 bg-white dark:bg-[#23201c] border border-[#e8e5df] dark:border-[#353029]">
            <GoldenRatioCalculator locale={locale} />
          </div>
        </div>
      </section>
    </div>
  )
}
