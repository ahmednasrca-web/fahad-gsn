'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/types'
import Logo from '@/components/brand/Logo'
import AtelierThemeSwitcher from '@/components/theme/AtelierThemeSwitcher'
import LocaleSwitcher from '@/components/LocaleSwitcher'

interface Props {
  navLinks: { href: string; label: string }[]
  locale: Locale
}

export default function MobileMenu({ navLinks, locale }: Props) {
  const [open, setOpen] = useState(false)
  const isAr = locale === 'ar'

  // Prevent body scroll when drawer is open
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

  return (
    <div>
      {/* Furnish Offcanvas Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center border border-[#ecebe9] dark:border-[#211f1c] text-[#11100e] dark:text-[#f6f5f4] transition hover:border-[#d47f31] hover:text-[#d47f31] cursor-pointer rounded-none"
        aria-expanded={open}
        aria-controls="furnish-offcanvas"
        aria-label={isAr ? 'فتح القائمة الجانبية' : 'Open navigation menu'}
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

      {/* Furnish Offcanvas Drawer & Backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Panel (End aligned) */}
          <aside
            id="furnish-offcanvas"
            className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col bg-white dark:bg-[#11100e] border-s border-[#ecebe9] dark:border-[#211f1c] shadow-2xl transition-transform duration-300 ease-in-out"
          >
            {/* Offcanvas Header */}
            <div className="flex h-20 items-center justify-between border-b border-[#ecebe9] dark:border-[#211f1c] px-6">
              <Logo locale={locale} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center border border-[#ecebe9] dark:border-[#211f1c] text-[#11100e] dark:text-[#f6f5f4] transition hover:border-[#d47f31] hover:text-[#d47f31] cursor-pointer rounded-none"
                aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
              >
                <svg
                  width="18"
                  height="18"
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

            {/* Offcanvas Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Offcanvas menu">
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href} className="border-b border-[#ecebe9]/60 dark:border-[#211f1c]/80">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[52px] items-center text-sm font-semibold uppercase tracking-wider text-[#615b51] dark:text-[#dad7d2] transition-colors hover:text-[#d47f31] dark:hover:text-[#d47f31]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Direct Phone Call Badge */}
              <div className="mt-8 pt-4">
                <a
                  href="tel:+96598908022"
                  className="flex items-center gap-3 p-3 border border-[#ecebe9] dark:border-[#211f1c] text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] hover:border-[#d47f31] hover:text-[#d47f31] transition-colors"
                >
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
                  <span>+965 98908022</span>
                </a>
              </div>

              {/* WhatsApp Quick Inquiry Button */}
              <div className="mt-3">
                <a
                  href="https://wa.me/96598908022"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-furnish-primary w-full text-center"
                >
                  {isAr ? 'تواصل عبر واتساب' : 'WhatsApp Inquiry'}
                </a>
              </div>
            </nav>

            {/* Offcanvas Footer Actions */}
            <div className="border-t border-[#ecebe9] dark:border-[#211f1c] bg-[#f6f5f4] dark:bg-[#181614] p-6 flex items-center justify-between">
              <LocaleSwitcher currentLocale={locale} />
              <AtelierThemeSwitcher locale={locale} />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
