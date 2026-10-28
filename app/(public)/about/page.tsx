import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { getDir, t, getContentValue } from '@/lib/i18n'
import { getSiteContent } from '@/lib/db/content'
import WoodSpeciesGuide from '@/components/wood/WoodSpeciesGuide'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'من نحن | فهد غصن' : 'About | Fahad Gsn',
    description: locale === 'ar'
      ? 'تعرّف على قصة ورشة فهد غصن وفلسفتنا في صناعة الأثاث والتحف الخشبية الفاخرة'
      : 'Learn about our atelier story, ethos, and bespoke woodworking philosophy',
  }
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'
  const content = await getSiteContent()

  const intro = getContentValue(content['about_intro'] ?? {}, locale)
  const philosophy = getContentValue(content['about_philosophy'] ?? {}, locale)
  const materials = getContentValue(content['about_materials'] ?? {}, locale)

  const defaultIntro = isAr
    ? 'فهد غصن حرفي كويتي متخصص في صناعة الأعمال الخشبية اليدوية الفاخرة والأثاث المخصص. مع شغف متوارث وخبرة طويلة، يحوّل فهد أندر جذوع الأشجار العالمية إلى تحف فنية متفردة وقطع وظيفية تدوم للأجيال.'
    : 'Fahad Gsn is a Kuwaiti master craftsman specializing in luxury bespoke furniture and collectible wooden sculptures. With deep reverence for timber and uncompromising precision, each creation is crafted to endure for generations.'

  const defaultPhilosophy = isAr
    ? 'نؤمن بأن كل قطعة خشب لها قصة تحكيها في عروقها الحية. فلسفتنا تقوم على احترام المادة الطبيعية، وتطبيق النسب الهندسية المعمارية، وتقديم عمل استثنائي يتجاوز التوقعات. لسنا نصنع أثاثاً اعتيادياً — بل نبتكر إرثاً وذكريات.'
    : 'We believe every timber grain holds an organic memory. Our philosophy centers on honoring raw nature, employing golden architectural proportions, and crafting heirloom pieces that transcend time.'

  const defaultMaterials = isAr
    ? 'ننتقي بعناية أندر أنواع الأخشاب الصلبة الطبيعية مثل الجوز الأمريكي، البلوط المعمر، الساج البورمي، وخشب الزيتون. تخضع كل قطعة لعمليات تجفيف وتشطيب يدوية بزيوت نباتية وشمع نحل طبيعي لحماية رونقها الأصيل.'
    : 'We carefully curate sustainable premier hardwoods including American Walnut, Ancient Oak, Burmese Teak, and Olive Wood. Hand-finished exclusively with natural botanical oils and beeswax.'

  return (
    <div dir={dir} className="bg-white dark:bg-[#11100e] text-[#11100e] dark:text-[#f6f5f4] transition-colors duration-300">
      {/* ── 1. Page Hero Header (Furnish About Header) ───────────── */}
      <section className="py-12 md:py-16 bg-[#f6f5f4] dark:bg-[#11100e] border-b border-[#ecebe9] dark:border-[#211f1c] text-center">
        <div className="container-site max-w-2xl mx-auto">
          <span className="furnish-subheading">
            {isAr ? 'قصة المشغل والحرفة' : 'About Our Atelier'}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-2 mb-4 font-display">
            {t(locale, 'aboutTitle')}
          </h1>
          <p className="text-sm sm:text-base text-[#615b51] dark:text-[#a0988d] leading-relaxed">
            {isAr
              ? 'رحلة تجمع بين أصالة التراث الكويتي والمعايير المعمارية العالمية في صياغة الخشب الطبيعي.'
              : 'Discover the craft, discipline, and timeless material dedication behind Fahad Gsn.'}
          </p>
        </div>
      </section>

      {/* ── 2. Split Story & Mission (Furnish Split Layout) ──────── */}
      <section className="py-16 md:py-24 border-b border-[#ecebe9] dark:border-[#211f1c]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square overflow-hidden furnish-card">
              <Image
                src="/furnish/about.jpg"
                alt={isAr ? 'مشغل فهد غصن' : 'Fahad Gsn Studio'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Story Details */}
            <div className="flex flex-col justify-center">
              <span className="furnish-subheading">
                {isAr ? 'من نحن' : 'Who We Are'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-2 mb-6">
                {isAr ? 'حرفة يدوية صلبة بروح وإتقان عالمي' : 'Where Master Craftsmanship Meets Living Design'}
              </h2>
              <p className="text-base leading-relaxed text-[#615b51] dark:text-[#dad7d2] mb-6">
                {intro ?? defaultIntro}
              </p>
              <p className="text-base leading-relaxed text-[#615b51] dark:text-[#dad7d2] mb-8">
                {philosophy ?? defaultPhilosophy}
              </p>

              <div>
                <Link href="/contact" className="btn-furnish-primary">
                  {isAr ? 'تواصل مع الحرفي فهد غصن' : 'Connect with the Artisan'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Our Core Values (Furnish Core Values Section) ─────── */}
      <section className="py-16 md:py-24 bg-[#f6f5f4] dark:bg-[#11100e] border-b border-[#ecebe9] dark:border-[#211f1c]">
        <div className="container-site">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="furnish-subheading">
              {isAr ? 'قيم الورشة' : 'Our Core Values'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-2 mb-3">
              {isAr ? 'مبادئ نصيغ بها كل قطعة' : 'The Pillars of Our Craft'}
            </h2>
            <p className="text-sm sm:text-base text-[#615b51] dark:text-[#a0988d]">
              {isAr
                ? 'لا مساومة على الجودة، نلتزم بأعلى معايير الاستدامة والدقة اليدوية في كل مرحلة.'
                : 'Every sculpture adheres to strict principles of material honesty, balance, and lifelong sustainability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Value 1 */}
            <div className="furnish-card p-8 bg-white dark:bg-[#181614] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 flex items-center justify-center border border-[#ecebe9] dark:border-[#211f1c] mb-6 text-[#d47f31]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#11100e] dark:text-[#f6f5f4] mb-3">
                  {isAr ? 'أصالة المادة الطبيعية' : 'Material Authenticity'}
                </h3>
                <p className="text-sm text-[#615b51] dark:text-[#a0988d] leading-relaxed">
                  {isAr
                    ? 'نحافظ على شكل الحواف الحية والتموجات الطبيعية للجذع دون طمس هوية الخشب.'
                    : 'We celebrate live edges, organic grain movement, and natural timber imperfections.'}
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="furnish-card p-8 bg-white dark:bg-[#181614] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 flex items-center justify-center border border-[#ecebe9] dark:border-[#211f1c] mb-6 text-[#d47f31]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#11100e] dark:text-[#f6f5f4] mb-3">
                  {isAr ? 'الدقة الهندسية والتعشيق' : 'Architectural Precision'}
                </h3>
                <p className="text-sm text-[#615b51] dark:text-[#a0988d] leading-relaxed">
                  {isAr
                    ? 'تعشيق خشبي يدوي دقيق يضمن تماسك القطعة لعقود طويلة دون تشققات أو التواء.'
                    : 'Meticulous traditional wood joinery built to handle temperature and moisture shifts flawlessly.'}
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="furnish-card p-8 bg-white dark:bg-[#181614] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 flex items-center justify-center border border-[#ecebe9] dark:border-[#211f1c] mb-6 text-[#d47f31]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#11100e] dark:text-[#f6f5f4] mb-3">
                  {isAr ? 'تشطيب طبيعي آمن' : 'Organic Botanical Finishes'}
                </h3>
                <p className="text-sm text-[#615b51] dark:text-[#a0988d] leading-relaxed">
                  {isAr
                    ? 'طلاء بزيوت نباتية نقية وشمع النحل العضوي، آمن على الصحة ويغذي ألياف الخشب.'
                    : '100% non-toxic botanical oils and organic beeswax that nourish and deepen grain luster.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Materials & Species Guide ─────────────────────────── */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#181614]">
        <div className="container-site">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="furnish-subheading">
              {isAr ? 'دليل الأخشاب' : 'Wood Species Guide'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-2 mb-3">
              {isAr ? 'أندر الأخشاب العالمية في متناولك' : 'Our Sustainable Material Palette'}
            </h2>
            <p className="text-sm sm:text-base text-[#615b51] dark:text-[#a0988d]">
              {materials ?? defaultMaterials}
            </p>
          </div>

          <div className="furnish-card p-6 bg-[#f6f5f4] dark:bg-[#11100e]">
            <WoodSpeciesGuide locale={locale} />
          </div>
        </div>
      </section>
    </div>
  )
}
