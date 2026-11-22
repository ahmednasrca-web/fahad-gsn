'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { Locale } from '@/lib/types'
import { getDir } from '@/lib/i18n'
import Logo from '@/components/brand/Logo'
import AtelierThemeSwitcher from '@/components/theme/AtelierThemeSwitcher'
import LocaleSwitcher from '@/components/LocaleSwitcher'

interface Props {
  navLinks: { href: string; label: string }[]
  locale: Locale
}

export default function MobileMenu({ navLinks, locale }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isAr = locale === 'ar'
  const dir = getDir(locale)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Handle Escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const drawerContent = (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      dir={dir}
      role="dialog"
      aria-modal="true"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Full-Height Drawer Panel */}
      <aside
        id="furnish-offcanvas"
        className="fixed inset-y-0 end-0 z-[10000] flex w-[88vw] max-w-[360px] h-[100dvh] flex-col bg-[#fcfbf9] dark:bg-[#161412] text-[#181614] dark:text-[#fbf9f6] border-s border-[#e8e5df] dark:border-[#2d2822] shadow-2xl transition-transform duration-200 ease-out"
      >
        {/* Drawer Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#e8e5df] dark:border-[#2d2822] px-6 shrink-0">
          <Logo locale={locale} showSubtitle={true} />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center border border-[#e8e5df] dark:border-[#2d2822] bg-white dark:bg-[#23201c] text-[#181614] dark:text-[#fbf9f6] hover:border-[#d47f31] hover:text-[#d47f31] cursor-pointer rounded-none transition-colors"
            aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Navigation Links & CTAs */}
        <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Offcanvas menu">
          <ul className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <li key={link.href} className="border-b border-[#e8e5df]/60 dark:border-[#2d2822]/80">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[52px] items-center justify-between text-sm sm:text-base font-semibold tracking-wide text-[#181614] dark:text-[#fbf9f6] transition-colors hover:text-[#d47f31] dark:hover:text-[#d47f31] py-2"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-[#8a8277] font-mono">0{idx + 1}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Quick Direct Telephone Card */}
          <div className="mt-8 pt-2">
            <a
              href="tel:+96598908022"
              className="flex items-center justify-between p-3.5 border border-[#e8e5df] dark:border-[#2d2822] bg-white dark:bg-[#23201c] text-sm font-bold text-[#181614] dark:text-[#fbf9f6] hover:border-[#d47f31] hover:text-[#d47f31] transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#d47f31]"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{isAr ? 'اتصال مباشر' : 'Direct Call'}</span>
              </div>
              <bdi dir="ltr" className="text-xs font-mono text-[#8a8277] dark:text-[#a0988d]">
                +965 98908022
              </bdi>
            </a>
          </div>

          {/* WhatsApp Direct Inquiry Button */}
          <div className="mt-3">
            <a
              href="https://wa.me/96598908022"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm py-3 px-4 shadow-2xs transition-colors rounded-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>{isAr ? 'استشارة عبر واتساب' : 'WhatsApp Inquiry'}</span>
            </a>
          </div>
        </nav>

        {/* Drawer Bottom Actions: Switchers */}
        <div className="border-t border-[#e8e5df] dark:border-[#2d2822] bg-[#f5f3ef] dark:bg-[#1c1916] p-5 flex items-center justify-between shrink-0">
          <LocaleSwitcher currentLocale={locale} />
          <AtelierThemeSwitcher locale={locale} />
        </div>
      </aside>
    </div>
  )

  return (
    <div>
      {/* Furnish Offcanvas Hamburger Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center border border-[#e8e5df] dark:border-[#2d2822] bg-white dark:bg-[#1c1916] text-[#181614] dark:text-[#fbf9f6] transition hover:border-[#d47f31] hover:text-[#d47f31] cursor-pointer rounded-none shadow-2xs"
        aria-expanded={open}
        aria-controls="furnish-offcanvas"
        aria-label={isAr ? 'فتح القائمة الرئيسية' : 'Open navigation menu'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </button>

      {/* Render Drawer into document.body via Portal to escape header containing block */}
      {mounted && open && createPortal(drawerContent, document.body)}
    </div>
  )
}
