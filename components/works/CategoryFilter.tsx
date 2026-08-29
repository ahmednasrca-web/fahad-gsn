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
  const isActive = (slug?: string) => slug === activeSlug

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      role="list"
      aria-label={locale === 'ar' ? 'تصفية حسب التصنيف' : 'Filter by category'}
    >
      {/* All works */}
      <Link
        href="/gallery"
        role="listitem"
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !activeSlug
            ? 'bg-[#2C1810] text-white'
            : 'border border-[#E8DDD0] bg-white text-[#3D2B1A] hover:border-[#C4854A]'
        }`}
        aria-current={!activeSlug ? 'page' : undefined}
      >
        {t(locale, 'allWorks')}
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/gallery?category=${cat.slug}`}
          role="listitem"
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isActive(cat.slug)
              ? 'bg-[#2C1810] text-white'
              : 'border border-[#E8DDD0] bg-white text-[#3D2B1A] hover:border-[#C4854A]'
          }`}
          aria-current={isActive(cat.slug) ? 'page' : undefined}
        >
          {getCategoryName(cat, locale)}
        </Link>
      ))}
    </div>
  )
}
