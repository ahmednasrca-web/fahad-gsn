import type { Metadata } from 'next'
import { getLocale } from '@/lib/locale'
import { getDir, t, getContentValue } from '@/lib/i18n'
import { getSiteContent } from '@/lib/db/content'
import ContactForm from '@/components/ContactForm'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '96598908022'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'تواصل معنا | فهد غصن' : 'Contact Us | Fahad Gsn',
    description: locale === 'ar'
      ? 'تواصل مع فهد غصن لطلب عمل مخصص أو الاستفسار عن مقتنيات المشغل'
      : 'Get in touch with Fahad Gsn for custom woodworking commissions and atelier visits',
  }
}

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'
  const content = await getSiteContent()

  const phone = getContentValue(content['contact_phone'] ?? {}, locale) ?? '+965 98908022'
  const instagram = getContentValue(content['contact_instagram'] ?? {}, locale) ?? '@fahad_gsn'
  const email = getContentValue(content['contact_email'] ?? {}, locale) ?? 'info@fahadgsn.com'
  const address = getContentValue(content['contact_address'] ?? {}, locale) ?? (isAr ? 'الكويت — المشغل الرئيسي' : 'Kuwait — Main Atelier')

  const whatsappUrl = `https://wa.me/${WHATSAPP}`

  return (
    <div dir={dir} className="bg-white dark:bg-[#11100e] text-[#11100e] dark:text-[#f6f5f4] transition-colors duration-300">
      {/* ── Page Hero Header (Furnish Contact Header) ───────────── */}
      <section className="py-12 md:py-16 bg-[#f6f5f4] dark:bg-[#11100e] border-b border-[#ecebe9] dark:border-[#211f1c] text-center">
        <div className="container-site max-w-2xl mx-auto">
          <span className="furnish-subheading">
            {isAr ? 'قنوات التواصل' : 'Get In Touch'}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-2 mb-4 font-display">
            {t(locale, 'contactTitle')}
          </h1>
          <p className="text-sm sm:text-base text-[#615b51] dark:text-[#a0988d] leading-relaxed">
            {t(locale, 'contactSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Main Split Contact Section (Furnish contact.html) ────── */}
      <section className="py-16 md:py-24">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct Contact Info (Furnish Get In Touch) */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="furnish-subheading mb-1">
                {isAr ? 'تواصل مباشر' : 'Atelier Contacts'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mb-4">
                {isAr ? 'نسعد بالإجابة عن استفساراتكم' : 'We’d Love to Hear from You'}
              </h2>
              <p className="text-sm sm:text-base text-[#615b51] dark:text-[#a0988d] leading-relaxed mb-8">
                {isAr
                  ? 'سواء كنت ترغب في تفصيل طاولة فاخرة، تحفة فنية مخصصة، أو حجز زيارة خاصة لمعاينة الأخشاب النادرة في المشغل.'
                  : 'Whether you wish to commission a bespoke table, an original sculpture, or schedule a private atelier viewing.'}
              </p>

              <div className="flex flex-col gap-6">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-[#ecebe9] dark:border-[#211f1c] text-[#d47f31]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a0988d] mb-1">
                      {isAr ? 'الموقع' : 'Location'}
                    </h4>
                    <p className="text-sm font-bold text-[#11100e] dark:text-[#f6f5f4]">
                      {address}
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-[#ecebe9] dark:border-[#211f1c] text-[#25D366]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a0988d] mb-1">
                      WhatsApp
                    </h4>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] hover:text-[#d47f31] transition-colors"
                    >
                      +965 98908022
                    </a>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-[#ecebe9] dark:border-[#211f1c] text-[#d47f31]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a0988d] mb-1">
                      {isAr ? 'الهاتف' : 'Telephone'}
                    </h4>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] hover:text-[#d47f31] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 border border-[#ecebe9] dark:border-[#211f1c] text-[#d47f31]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#a0988d] mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email'}
                    </h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] hover:text-[#d47f31] transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Furnish Form Card (Send a Message) */}
            <div className="lg:col-span-7">
              <div className="furnish-card p-6 sm:p-10 bg-white dark:bg-[#181614]">
                <h3 className="text-2xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mb-2 font-display">
                  {isAr ? 'أرسل لنا رسالة أو طلباً مخصصاً' : 'Send a Commission Message'}
                </h3>
                <p className="text-sm text-[#615b51] dark:text-[#a0988d] mb-6">
                  {isAr ? 'سيتواصل معك الحرفي فهد غصن مباشرة لدراسة تفاصيل طلبك.' : 'Artisan Fahad Gsn will review your request and reply shortly.'}
                </p>

                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
