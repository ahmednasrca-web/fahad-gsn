import Link from 'next/link'
import { getLocale } from '@/lib/locale'
import { t } from '@/lib/i18n'
import { getDir } from '@/lib/i18n'
import Logo from '@/components/brand/Logo'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import MobileMenu from './MobileMenu'

export default async function SiteHeader() {
  const locale = await getLocale()
  const dir = getDir(locale)

  const navLinks = [
    { href: '/', label: t(locale, 'home') },
    { href: '/gallery', label: t(locale, 'gallery') },
    { href: '/reels', label: t(locale, 'reels') },
    { href: '/about', label: t(locale, 'about') },
    { href: '/contact', label: t(locale, 'contact') },
  ]

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#E8DDD0] bg-[#FAF7F2]/90 backdrop-blur-md"
      dir={dir}
    >
      <div className="container-site flex h-16 items-center justify-between">
        {/* Official Brand Logo */}
        <Logo locale={locale} />

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#3D2B1A] transition-colors hover:bg-[#F0E8D8] hover:text-[#2C1810]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher currentLocale={locale} />
          {/* Mobile menu trigger */}
          <MobileMenu navLinks={navLinks} locale={locale} />
        </div>
      </div>
    </header>
  )
}
