import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { t } from '@/lib/i18n'
import { getDir } from '@/lib/i18n'
import Logo from '@/components/brand/Logo'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import AtelierThemeSwitcher from '@/components/theme/AtelierThemeSwitcher'
import MobileMenu from './MobileMenu'

export default async function SiteHeader() {
  const locale = await getLocale()
  const dir = getDir(locale)

  const navLinks = [
    { href: '/', label: t(locale, 'home') },
    { href: '/gallery', label: t(locale, 'gallery') },
    { href: '/reels', label: t(locale, 'reels') },
    { href: '/concierge', label: locale === 'ar' ? 'جلسة خاصة' : 'Private Visit' },
    { href: '/about', label: t(locale, 'about') },
    { href: '/contact', label: t(locale, 'contact') },
  ]

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#ecebe9] dark:border-[#211f1c] bg-white/95 dark:bg-[#11100e]/95 backdrop-blur-md shadow-2xs transition-colors duration-300"
      dir={dir}
    >
      <div className="container-site flex h-20 items-center justify-between gap-4">
        {/* Furnish Brand Logo Lockup */}
        <Logo locale={locale} />

        {/* Desktop Centered Navigation (Furnish Editorial Navbar) */}
        <nav
          className="hidden items-center gap-1 xl:gap-2 lg:flex mx-auto"
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#615b51] dark:text-[#dad7d2] transition-colors hover:text-[#d47f31] dark:hover:text-[#d47f31]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions: Direct Phone + Theme + Locale + Offcanvas Drawer */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Furnish Quick Telephone CTA */}
          <a
            href="tel:+96598908022"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] hover:text-[#d47f31] transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#d47f31]"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span dir="ltr">+965 98908022</span>
          </a>

          {/* Theme Switcher */}
          <AtelierThemeSwitcher locale={locale} />

          {/* Locale Switcher */}
          <LocaleSwitcher currentLocale={locale} />

          {/* Furnish Offcanvas Drawer Trigger */}
          <MobileMenu navLinks={navLinks} locale={locale} />
        </div>
      </div>
    </header>
  )
}
