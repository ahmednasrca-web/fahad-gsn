import type { Metadata } from 'next'
import { getLocale } from '@/lib/locale'
import { getDir, t, getContentValue } from '@/lib/i18n'
import { getSiteContent } from '@/lib/db/content'
import ContactForm from '@/components/ContactForm'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '96598908022'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'ar' ? 'تواصل | فهد غصن' : 'Contact | Fahad Gsn',
    description: locale === 'ar'
      ? 'تواصل مع فهد غصن لطلب عمل مخصص أو الاستفسار'
      : 'Contact Fahad Gsn for custom orders or inquiries',
  }
}

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const content = await getSiteContent()

  const phone = getContentValue(content['contact_phone'] ?? {}, locale) ?? '+965 98908022'
  const instagram = getContentValue(content['contact_instagram'] ?? {}, locale)
  const email = getContentValue(content['contact_email'] ?? {}, locale)

  const whatsappUrl = `https://wa.me/${WHATSAPP}`

  return (
    <div dir={dir}>
      {/* Hero */}
      <section className="section-padding bg-[#2C1810]">
        <div className="container-site text-center">
          <h1 className="text-4xl font-bold text-[#FAF7F2] md:text-5xl">
            {t(locale, 'contactTitle')}
          </h1>
          <p className="mt-4 text-[#D4B896]">
            {t(locale, 'contactSubtitle')}
          </p>
        </div>
      </section>

      <section className="section-padding bg-[#FAF7F2]">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-[#1A1209]">
                {locale === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </h2>

              <ul className="flex flex-col gap-5">
                {/* WhatsApp */}
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-4 transition-colors hover:border-[#C4854A]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5C4E]">
                        {t(locale, 'whatsapp')}
                      </p>
                      <p className="text-base font-medium text-[#1A1209]">
                        +965 98908022
                      </p>
                    </div>
                  </a>
                </li>

                {/* Phone */}
                <li>
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-4 transition-colors hover:border-[#C4854A]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0E8D8]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B3F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.13 1.05.37 2.08.72 3.07a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.01-1.01a2 2 0 012.11-.45c.99.35 2.02.59 3.07.72A2 2 0 0122 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5C4E]">
                        {t(locale, 'phone')}
                      </p>
                      <p className="text-base font-medium text-[#1A1209]">{phone}</p>
                    </div>
                  </a>
                </li>

                {/* Instagram (if set) */}
                {instagram && (
                  <li>
                    <a
                      href={`https://instagram.com/${instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-4 transition-colors hover:border-[#C4854A]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0E8D8]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B3F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <circle cx="12" cy="12" r="4"/>
                          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5C4E]">
                          Instagram
                        </p>
                        <p className="text-base font-medium text-[#1A1209]">{instagram}</p>
                      </div>
                    </a>
                  </li>
                )}

                {/* Email (if set) */}
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-4 transition-colors hover:border-[#C4854A]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0E8D8]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B3F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5C4E]">
                          {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                        </p>
                        <p className="text-base font-medium text-[#1A1209]">{email}</p>
                      </div>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-[#1A1209]">
                {t(locale, 'sendMessage')}
              </h2>
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
