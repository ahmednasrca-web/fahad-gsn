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
      className="sticky top-0 z-40 border-b border-[#e8e5df] dark:border-[#2d2822] bg-[#fcfbf9]/95 dark:bg-[#161412]/95 backdrop-blur-md shadow-2xs transition-colors duration-200"
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
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#181614] dark:text-[#fbf9f6] transition-colors hover:text-[#d47f31] dark:hover:text-[#d47f31]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Responsive Right Actions: Direct Phone + Theme + Locale + Offcanvas Drawer */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Quick Telephone CTA (Compact square on small mobile, expanded text on sm+) */}
          <a
            href="tel:+96598908022"
            className="flex h-10 w-10 sm:h-auto sm:w-auto items-center justify-center sm:px-3 sm:py-2 border border-[#e8e5df] dark:border-[#2d2822] bg-white dark:bg-[#23201c] sm:border-0 sm:bg-transparent text-xs font-bold text-[#181614] dark:text-[#fbf9f6] hover:text-[#d47f31] transition-colors rounded-none shadow-2xs sm:shadow-none"
            aria-label={locale === 'ar' ? 'اتصال مباشر' : 'Call Fahad Gsn'}
            title="+965 98908022"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#d47f31]"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span dir="ltr" className="hidden sm:inline-block ms-2">+965 98908022</span>
          </a>

          {/* Theme Switcher (visible in header on md+ screens, inside mobile menu on mobile) */}
          <div className="hidden md:inline-flex">
            <AtelierThemeSwitcher locale={locale} />
          </div>

          {/* Locale Switcher (visible in header on sm+ screens, inside mobile menu on mobile) */}
          <div className="hidden sm:inline-flex">
            <LocaleSwitcher currentLocale={locale} />
          </div>

          {/* Furnish Offcanvas Drawer Trigger (visible on mobile/tablet up to lg) */}
          <div className="lg:hidden">
            <MobileMenu navLinks={navLinks} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  )
}
