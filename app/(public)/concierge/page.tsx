import type { Metadata } from 'next'
import { getLocale } from '@/lib/locale'
import { getDir } from '@/lib/i18n'
import PrivateAtelierBookingModal from '@/components/concierge/PrivateAtelierBookingModal'
import GoldenRatioCalculator from '@/components/interactive/GoldenRatioCalculator'

export const metadata: Metadata = {
  title: 'حجز زيارة خاصة للمشغل | Private Atelier Visit',
  description: 'احجز جلسة استشارة خاصة في مشغل فهد غصن لمعاينة الأخشاب النادرة ومناقشة تفصيل قطعتك الفريدة.',
}

export default async function ConciergePage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'

  return (
    <div className="bg-white dark:bg-[#11100e] text-[#11100e] dark:text-[#f6f5f4] transition-colors duration-300" dir={dir}>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[#f6f5f4] dark:bg-[#11100e] border-b border-[#ecebe9] dark:border-[#211f1c] text-center">
        <div className="container-site max-w-2xl mx-auto">
          <span className="furnish-subheading">
            {isAr ? 'تجربة حصرية لكبار الشخصيات' : 'VIP Concierge & Atelier Experience'}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-2 mb-4 font-display">
            {isAr ? 'زيارة خاصة لورشة فهد غصن' : 'Private Atelier Visit'}
          </h1>
          <p className="text-sm sm:text-base text-[#615b51] dark:text-[#a0988d] leading-relaxed">
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
          <div className="furnish-card p-6 bg-[#f6f5f4] dark:bg-[#181614]">
            <GoldenRatioCalculator locale={locale} />
          </div>
        </div>
      </section>
    </div>
  )
}
