'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import LogoIcon from '@/components/brand/LogoIcon'

const NAV_ITEMS = [
  { href: '/admin', label: 'الرئيسية', icon: '⊞', exact: true },
  { href: '/admin/works', label: 'الأعمال', icon: '🪵' },
  { href: '/admin/reels', label: 'الريلز', icon: '🎬' },
  { href: '/admin/categories', label: 'التصنيفات', icon: '📂' },
  { href: '/admin/content', label: 'المحتوى', icon: '✏️' },
  { href: '/admin/messages', label: 'الرسائل', icon: '💬' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#211f1c] bg-[#11100e] px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center bg-white/10 rounded-none">
            <LogoIcon size={20} color="copper" />
          </div>
          <span className="font-bold text-white text-sm tracking-wide">فهد غصن — الإدارة</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center border border-[#211f1c] text-white transition hover:border-[#d47f31] hover:text-[#d47f31] rounded-none"
          aria-label="فتح القائمة"
          aria-expanded={mobileOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {mobileOpen ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></> : <><path d="M4 8h16"/><path d="M4 16h16"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <nav className="absolute inset-y-0 end-0 w-72 bg-[#11100e] border-s border-[#211f1c] p-5 pt-20 shadow-2xl" aria-label="قائمة الإدارة">
            <ul className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-[48px] items-center gap-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors rounded-none ${isActive(item) ? 'bg-[#d47f31] text-white' : 'text-[#dad7d2] hover:bg-white/5 hover:text-white'}`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-6 border-t border-[#211f1c] pt-4">
                <form action="/api/admin/logout" method="POST">
                  <button type="submit" className="flex min-h-[48px] w-full items-center gap-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#a0988d] hover:bg-white/5 hover:text-white transition-colors rounded-none">
                    <span aria-hidden="true">↩</span>
                    تسجيل الخروج
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#11100e] border-e border-[#211f1c] md:flex" aria-label="الشريط الجانبي">
        <div className="border-b border-[#211f1c] px-5 py-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-none bg-white/10 text-white">
            <LogoIcon size={24} color="copper" />
          </div>
          <div>
            <p className="font-bold text-white leading-tight font-display tracking-wide">فهد غصن</p>
            <p className="text-[10px] uppercase tracking-widest text-[#d47f31] font-semibold mt-0.5">لوحة التحكم</p>
          </div>
        </div>

        <nav className="flex-1 p-4" aria-label="قائمة الإدارة">
          <ul className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex min-h-[44px] items-center gap-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors rounded-none ${isActive(item) ? 'bg-[#d47f31] text-white shadow-xs' : 'text-[#dad7d2] hover:bg-white/5 hover:text-white'}`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-[#211f1c] p-4">
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="flex min-h-[44px] w-full items-center gap-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#a0988d] hover:bg-white/5 hover:text-[#d47f31] transition-colors rounded-none cursor-pointer">
              <span aria-hidden="true">↩</span>
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
