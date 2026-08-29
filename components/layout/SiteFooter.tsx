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
  const content = await getSiteContent()

  const phone = getContentValue(content['contact_phone'] ?? {}, locale) ?? '+965 98908022'
  const instagram = getContentValue(content['contact_instagram'] ?? {}, locale)
  const tagline = getContentValue(content['footer_tagline'] ?? {}, locale)

  const whatsappUrl = `https://wa.me/${WHATSAPP}`

  return (
    <footer
      className="border-t border-[#E8DDD0] bg-[#2C1810] text-[#D4B896]"
      dir={dir}
    >
      <div className="container-site py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Logo locale={locale} theme="dark" showSubtitle={true} />
            {tagline && (
              <p className="text-sm text-[#A09080] leading-relaxed">{tagline}</p>
            )}
          </div>

          {/* Navigation */}
          <nav aria-label={locale === 'ar' ? 'روابط الموقع' : 'Site links'}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A09080]">
              {locale === 'ar' ? 'الموقع' : 'Site'}
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { href: '/', label: t(locale, 'home') },
                { href: '/gallery', label: t(locale, 'gallery') },
                { href: '/about', label: t(locale, 'about') },
                { href: '/contact', label: t(locale, 'contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#D4B896] transition-colors hover:text-[#FAF7F2]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A09080]">
              {t(locale, 'contact')}
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#D4B896] transition-colors hover:text-[#FAF7F2]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-[#D4B896] transition-colors hover:text-[#FAF7F2]"
                >
                  {phone}
                </a>
              </li>
              {instagram && (
                <li>
                  <a
                    href={`https://instagram.com/${instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4B896] transition-colors hover:text-[#FAF7F2]"
                  >
                    {instagram}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#3D2316] pt-6 text-center">
          <p className="text-xs text-[#A09080]">
            {t(locale, 'footerRights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
