import type { Metadata } from 'next'
import { getLocale } from '@/lib/locale'
import { getDir, t } from '@/lib/i18n'
import { getPublishedReels } from '@/lib/db/reels'
import ReelsGrid from '@/components/reels/ReelsGrid'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'ريلز & كواليس الحرفة | فهد غصن' : 'Reels & Craft in Motion | Fahad Gsn',
    description: locale === 'ar'
      ? 'شاهد مقاطع الريلز وفيديوهات كواليس نحت وتشكيل الأعمال الخشبية الفاخرة يدوياً — فهد غصن، الكويت'
      : 'Watch reels and behind-the-scenes videos of luxury handcrafted woodworking by Kuwaiti artisan Fahad Gsn',
  }
}

export default async function ReelsPage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const reels = await getPublishedReels()

  return (
    <div dir={dir} className="bg-white dark:bg-[#11100e] text-[#11100e] dark:text-[#f6f5f4] transition-colors duration-300 min-h-[70vh]">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[#f6f5f4] dark:bg-[#11100e] border-b border-[#ecebe9] dark:border-[#211f1c] text-center">
        <div className="container-site max-w-2xl mx-auto">
          <span className="furnish-subheading">
            {t(locale, 'reelsHeroTagline')}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-2 mb-4 font-display">
            {t(locale, 'reelsHeroTitle')}
          </h1>
          <p className="text-sm sm:text-base text-[#615b51] dark:text-[#a0988d] leading-relaxed">
            {t(locale, 'reelsHeroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Reels Grid ───────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          <ReelsGrid reels={reels} locale={locale} />
        </div>
      </section>
    </div>
  )
}
