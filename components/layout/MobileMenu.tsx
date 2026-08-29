'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/types'

interface Props {
  navLinks: { href: string; label: string }[]
  locale: Locale
}

export default function MobileMenu({ navLinks, locale }: Props) {
  const [open, setOpen] = useState(false)

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [])

  // Prevent body scroll when open
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

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#3D2B1A] transition hover:bg-[#F0E8D8]"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={locale === 'ar' ? 'فتح القائمة' : 'Open menu'}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 8h16M4 16h16" />
          </svg>
        )}
      </button>

      {/* Overlay + Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-menu"
            className="fixed inset-x-0 top-16 z-50 border-b border-[#E8DDD0] bg-[#FAF7F2] px-4 py-4 shadow-xl"
            aria-label={locale === 'ar' ? 'قائمة الموبايل' : 'Mobile navigation'}
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium text-[#3D2B1A] transition hover:bg-[#F0E8D8] hover:text-[#2C1810]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}
