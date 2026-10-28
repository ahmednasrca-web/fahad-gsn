'use client'

import Link from 'next/link'
import type { Category, Locale } from '@/lib/types'
import { getCategoryName, t } from '@/lib/i18n'

interface Props {
  categories: Category[]
  activeSlug?: string
  locale: Locale
}

export default function CategoryFilter({ categories, activeSlug, locale }: Props) {
  const isActive = (slug?: string) => (!slug && !activeSlug) || slug === activeSlug

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap sm:flex-nowrap"
      role="tablist"
      aria-label={locale === 'ar' ? 'تصفية حسب التصنيف' : 'Filter by category'}
    >
      {/* All works Tab */}
      <Link
        href="/gallery"
        role="tab"
        aria-selected={!activeSlug}
        className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded-none border whitespace-nowrap cursor-pointer ${
          !activeSlug
            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs'
            : 'bg-white dark:bg-[#181614] border-[#ecebe9] dark:border-[#211f1c] text-[#615b51] dark:text-[#dad7d2] hover:border-[#d47f31] hover:text-[#d47f31]'
        }`}
      >
        {t(locale, 'allWorks')}
      </Link>

      {categories.map((cat) => {
        const active = isActive(cat.slug)
        return (
          <Link
            key={cat.id}
            href={`/gallery?category=${cat.slug}`}
            role="tab"
            aria-selected={active}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 rounded-none border whitespace-nowrap cursor-pointer ${
              active
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xs'
                : 'bg-white dark:bg-[#181614] border-[#ecebe9] dark:border-[#211f1c] text-[#615b51] dark:text-[#dad7d2] hover:border-[#d47f31] hover:text-[#d47f31]'
            }`}
          >
            {getCategoryName(cat, locale)}
          </Link>
        )
      })}
    </div>
  )
}


