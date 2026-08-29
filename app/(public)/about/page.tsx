import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { getDir, t, getContentValue } from '@/lib/i18n'
import { getSiteContent } from '@/lib/db/content'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'من نحن | فهد غصن' : 'About | Fahad Gsn',
    description: locale === 'ar'
      ? 'تعرّف على قصتنا وفلسفتنا في صناعة الأخشاب'
      : 'Learn about our story and woodworking philosophy',
  }
}

export const revalidate = 300

export default async function AboutPage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const content = await getSiteContent()

  const intro = getContentValue(content['about_intro'] ?? {}, locale)
  const philosophy = getContentValue(content['about_philosophy'] ?? {}, locale)
  const materials = getContentValue(content['about_materials'] ?? {}, locale)

  // Default content if CMS is empty
  const defaultIntro = locale === 'ar'
    ? 'فهد غصن حرفي كويتي متخصص في صناعة الأعمال الخشبية اليدوية الفاخرة. مع سنوات من الخبرة والشغف، يحوّل فهد أجود أنواع الخشب إلى تحف فنية وقطع وظيفية تدوم للأجيال.'
    : 'Fahad Gsn is a Kuwaiti craftsman specializing in luxury handcrafted wood works. With years of experience and passion, Fahad transforms the finest wood into artistic pieces and functional items built to last for generations.'

  const defaultPhilosophy = locale === 'ar'
    ? 'نؤمن بأن كل قطعة خشب لها قصة تحكيها. فلسفتنا تقوم على احترام المادة الطبيعية، والاهتمام بأدق التفاصيل، وتقديم عمل يتجاوز توقعات صاحبه. لسنا نصنع أثاثاً — نصنع ذكريات.'
    : 'We believe every piece of wood has a story to tell. Our philosophy is rooted in respecting natural materials, attention to the finest details, and delivering work that exceeds expectations. We don\'t make furniture — we make memories.'

  const defaultMaterials = locale === 'ar'
    ? 'نستخدم أجود أنواع الخشب المستدامة مثل الجوز والبلوط والساج. كل قطعة تمر بعمليات تشطيب يدوية دقيقة وطلاء طبيعي يبرز جمال الحبوب الطبيعية للخشب.'
    : 'We use premium sustainable woods including walnut, oak, and teak. Every piece goes through meticulous hand-finishing and natural coating that highlights the wood\'s natural grain beauty.'

  return (
    <div dir={dir}>
      {/* Hero */}
      <section className="section-padding bg-[#2C1810]">
        <div className="container-site text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#C4854A]">
            {locale === 'ar' ? 'قصتنا' : 'Our Story'}
          </p>
          <h1 className="text-4xl font-bold text-[#FAF7F2] md:text-5xl">
            {t(locale, 'aboutTitle')}
          </h1>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-[#FAF7F2]">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-[#1A1209]">
              {locale === 'ar' ? 'من نحن' : 'Who We Are'}
            </h2>
            <p className="text-lg leading-relaxed text-[#3D2B1A]">
              {intro ?? defaultIntro}
            </p>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="flex items-center justify-center py-2" aria-hidden="true">
        <div className="h-px w-24 bg-[#C4854A]" />
        <div className="mx-4 h-2 w-2 rounded-full bg-[#C4854A]" />
        <div className="h-px w-24 bg-[#C4854A]" />
      </div>

      {/* Philosophy */}
      <section className="section-padding bg-[#F0E8D8]">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-[#1A1209]">
              {locale === 'ar' ? 'فلسفتنا' : 'Our Philosophy'}
            </h2>
            <p className="text-lg leading-relaxed text-[#3D2B1A]">
              {philosophy ?? defaultPhilosophy}
            </p>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="section-padding bg-[#FAF7F2]">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-[#1A1209]">
              {locale === 'ar' ? 'موادنا' : 'Our Materials'}
            </h2>
            <p className="text-lg leading-relaxed text-[#3D2B1A]">
              {materials ?? defaultMaterials}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#2C1810] text-center">
        <div className="container-site">
          <h2 className="mb-4 text-2xl font-bold text-[#FAF7F2]">
            {locale === 'ar' ? 'هل لديك مشروع في ذهنك؟' : 'Have a project in mind?'}
          </h2>
          <p className="mb-8 text-[#D4B896]">
            {locale === 'ar' ? 'تحدّث معنا وسنحوّل فكرتك إلى واقع' : 'Talk to us and we\'ll bring your idea to life'}
          </p>
          <Link
            href="/contact"
            className="inline-flex min-h-[52px] items-center rounded-full bg-[#C4854A] px-10 font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t(locale, 'contact')}
          </Link>
        </div>
      </section>
    </div>
  )
}
