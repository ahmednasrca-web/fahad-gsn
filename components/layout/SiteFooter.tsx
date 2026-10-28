import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { t } from '@/lib/i18n'
import { getDir } from '@/lib/i18n'
import { getSiteContent } from '@/lib/db/content'
import { getContentValue } from '@/lib/i18n'
import Logo from '@/components/brand/Logo'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '96598908022'

export default async function SiteFooter() {
  const locale = await getLocale()
  const dir = getDir(locale)
  const isAr = locale === 'ar'
  const content = await getSiteContent()

  const phone = getContentValue(content['contact_phone'] ?? {}, locale) ?? '+965 98908022'
  const email = getContentValue(content['contact_email'] ?? {}, locale) ?? 'info@fahadgsn.com'
  const instagram = getContentValue(content['contact_instagram'] ?? {}, locale) ?? 'fahad_gsn'

  const whatsappUrl = `https://wa.me/${WHATSAPP}`
  const instagramUrl = `https://instagram.com/${instagram.replace('@', '')}`

  return (
    <footer
      className="bg-[#11100e] text-[#a0988d] border-t border-[#211f1c] pt-16 pb-8 transition-colors duration-300"
      dir={dir}
    >
      <div className="container-site">
        {/* ── Top Row: Brand & Horizontal Nav Links ────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-[#211f1c]">
          <div>
            <Logo locale={locale} theme="dark" showSubtitle={true} />
          </div>

          <nav aria-label={isAr ? 'روابط التذييل' : 'Footer navigation'}>
            <ul className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold uppercase tracking-wider">
              <li>
                <Link href="/" className="text-[#dad7d2] hover:text-[#d47f31] transition-colors">
                  {t(locale, 'home')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-[#dad7d2] hover:text-[#d47f31] transition-colors">
                  {t(locale, 'gallery')}
                </Link>
              </li>
              <li>
                <Link href="/reels" className="text-[#dad7d2] hover:text-[#d47f31] transition-colors">
                  {t(locale, 'reels')}
                </Link>
              </li>
              <li>
                <Link href="/concierge" className="text-[#dad7d2] hover:text-[#d47f31] transition-colors">
                  {isAr ? 'جلسة خاصة' : 'Private Visit'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#dad7d2] hover:text-[#d47f31] transition-colors">
                  {t(locale, 'about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#dad7d2] hover:text-[#d47f31] transition-colors">
                  {t(locale, 'contact')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* ── Middle Row 1: Furnish Statement & Social Icon Buttons ── */}
        <div className="py-12 md:py-16 border-b border-[#211f1c]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
            <div className="lg:col-span-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight font-display leading-[1.1]">
                {isAr ? 'نبتكر تحفاً خشبية تدوم للأجيال' : 'We Craft Timeless Wood for the World'}
              </h2>
            </div>

            <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-3">
              {/* Instagram Square Button */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[#211f1c] text-white hover:border-[#d47f31] hover:text-[#d47f31] transition-colors rounded-none"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* WhatsApp Square Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[#211f1c] text-white hover:border-[#25D366] hover:text-[#25D366] transition-colors rounded-none"
                aria-label="WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              {/* Telephone Square Button */}
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="w-12 h-12 flex items-center justify-center border border-[#211f1c] text-white hover:border-[#d47f31] hover:text-[#d47f31] transition-colors rounded-none"
                aria-label="Phone"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>

              {/* Email Square Button */}
              <a
                href={`mailto:${email}`}
                className="w-12 h-12 flex items-center justify-center border border-[#211f1c] text-white hover:border-[#d47f31] hover:text-[#d47f31] transition-colors rounded-none"
                aria-label="Email"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Middle Row 2: Direct Contact Inquiry Block ───────────── */}
        <div className="py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#211f1c]">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-[#837a6d]">
              {isAr ? 'البريد الإلكتروني المباشر' : 'Direct Email Address'}
            </span>
            <a
              href={`mailto:${email}`}
              className="text-xl sm:text-2xl font-normal text-white hover:text-[#d47f31] transition-colors mt-1 font-mono"
            >
              {email}
            </a>
          </div>

          <div>
            <Link
              href="/contact"
              className="btn-furnish-outline border-white text-white hover:bg-white hover:text-black inline-flex"
            >
              {isAr ? 'طلب تفصيل قطعة خاصة ←' : 'Start a Commission →'}
            </Link>
          </div>
        </div>

        {/* ── Bottom Row: Copyright & Admin Portal Link ─────────────── */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#837a6d]">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} {isAr ? 'فهد غصن. جميع الحقوق محفوظة.' : 'Fahad Gsn Atelier. All rights reserved.'}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              {isAr ? 'عن المشغل' : 'Our Ethos'}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {isAr ? 'سياسة الخصوصية' : 'Privacy & Terms'}
            </Link>
            <Link
              href="/admin"
              className="text-[#615b51] hover:text-[#d47f31] transition-colors"
              title={isAr ? 'بوابة الإدارة' : 'Admin Portal'}
            >
              {isAr ? 'لوحة التحكم' : 'Admin'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
