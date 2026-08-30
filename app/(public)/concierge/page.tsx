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
    <div className="section-padding bg-[#FAF7F2] dark:bg-[#0E0805] transition-colors duration-400" dir={dir}>
      <div className="container-site space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto">
          <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
            {isAr ? 'تجربة حصرية لكبار الشخصيات' : 'VIP Concierge & Atelier Experience'}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-[#1A1209] dark:text-[#FAF7F2] md:text-5xl font-display">
            {isAr ? 'زيارة خاصة لورشة فهد غصن' : 'Private Atelier Visit'}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#6B5C4E] dark:text-[#D4B896] leading-relaxed">
            {isAr
              ? 'نرحب بكم في زيارة خاصة للمشغل لمعاينة ألواح الأخشاب المعمرة النادرة، فحص نقاء العروق المجهرية، ومناقشة تصميم قطعتكم الفريدة مباشرة مع الحرفي فهد غصن.'
              : 'Experience a private walkthrough of our Kuwait atelier. Inspect rare aged timber slabs and discuss bespoke commissions directly with artisan Fahad Gsn.'}
          </p>

          <div className="mt-6 flex justify-center">
            <PrivateAtelierBookingModal
              locale={locale}
              buttonClassName="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#C4854A] px-8 text-sm font-bold text-white shadow-xl shadow-[#C4854A]/30 hover:scale-105 transition-all"
            />
          </div>
        </div>

        {/* Golden Ratio Proportions Tool */}
        <div className="pt-6">
          <GoldenRatioCalculator locale={locale} />
        </div>
      </div>
    </div>
  )
}
