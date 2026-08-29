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
    <div dir={dir} className="section-padding">
      <div className="container-site">
        {/* Page Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className={`mb-2 text-[#C4854A] font-bold ${locale === 'ar' ? 'text-xs font-display' : 'text-xs uppercase tracking-[0.25em]'}`}>
            {t(locale, 'reelsHeroTagline')}
          </p>
          <h1 className="text-4xl font-bold text-[#1A1209] md:text-5xl font-display">
            {t(locale, 'reelsHeroTitle')}
          </h1>
          <p className="mt-4 text-base text-[#6B5C4E] leading-relaxed">
            {t(locale, 'reelsHeroSubtitle')}
          </p>
        </div>

        {/* Reels Grid */}
        <ReelsGrid reels={reels} locale={locale} />
      </div>
    </div>
  )
}
