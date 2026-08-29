'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/admin', label: 'الرئيسية', icon: '⊞', exact: true },
  { href: '/admin/works', label: 'الأعمال', icon: '🪵' },
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
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#2C1810] px-4 md:hidden">
        <span className="font-bold text-white">فهد غصن — الإدارة</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <nav className="absolute inset-y-0 end-0 w-64 bg-[#2C1810] p-4 pt-16 shadow-2xl" aria-label="قائمة الإدارة">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors ${isActive(item) ? 'bg-[#C4854A] text-white' : 'text-[#D4B896] hover:bg-white/10 hover:text-white'}`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-4 border-t border-white/20 pt-4">
                <form action="/api/admin/logout" method="POST">
                  <button type="submit" className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#D4B896] hover:bg-white/10 hover:text-white transition-colors">
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
      <aside className="hidden w-56 shrink-0 flex-col bg-[#2C1810] md:flex" aria-label="الشريط الجانبي">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="font-bold text-white">فهد غصن</p>
          <p className="text-xs text-[#A09080]">لوحة التحكم</p>
        </div>
        <nav className="flex-1 p-3" aria-label="قائمة الإدارة">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${isActive(item) ? 'bg-[#C4854A] text-white' : 'text-[#D4B896] hover:bg-white/10 hover:text-white'}`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-white/10 p-3">
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#A09080] hover:bg-white/10 hover:text-[#D4B896] transition-colors">
              <span aria-hidden="true">↩</span>
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
