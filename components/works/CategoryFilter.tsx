'use client'

import Link from 'next/link'
import type { Category, Locale } from '@/lib/types'
import { getCategoryName, t } from '@/lib/i18n'
import { Chip } from '@heroui/react'

interface Props {
  categories: Category[]
  activeSlug?: string
  locale: Locale
}

export default function CategoryFilter({ categories, activeSlug, locale }: Props) {
  const isActive = (slug?: string) => (!slug && !activeSlug) || slug === activeSlug

  return (
    <div
      className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none"
      role="tablist"
      aria-label={locale === 'ar' ? 'تصفية حسب التصنيف' : 'Filter by category'}
    >
      {/* All works Tab/Chip */}
      <Link
        href="/gallery"
        role="tab"
        aria-selected={!activeSlug}
        className="focus:outline-none"
      >
        <Chip.Root
          color={!activeSlug ? 'accent' : 'default'}
          size="md"
          variant={!activeSlug ? 'primary' : 'soft'}
          className={`cursor-pointer px-4 py-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
            !activeSlug
              ? 'shadow-xs font-semibold'
              : 'border border-[#E8DDD0] dark:border-[#2C1B10] hover:border-[#C4854A] bg-white dark:bg-[#1A1009] text-[#3D2B1A] dark:text-[#FAF7F2]'
          }`}
        >
          <Chip.Label>{t(locale, 'allWorks')}</Chip.Label>
        </Chip.Root>
      </Link>

      {categories.map((cat) => {
        const active = isActive(cat.slug)
        return (
          <Link
            key={cat.id}
            href={`/gallery?category=${cat.slug}`}
            role="tab"
            aria-selected={active}
            className="focus:outline-none"
          >
            <Chip.Root
              color={active ? 'accent' : 'default'}
              size="md"
              variant={active ? 'primary' : 'soft'}
              className={`cursor-pointer px-4 py-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                active
                  ? 'shadow-xs font-semibold'
                  : 'border border-[#E8DDD0] dark:border-[#2C1B10] hover:border-[#C4854A] bg-white dark:bg-[#1A1009] text-[#3D2B1A] dark:text-[#FAF7F2]'
              }`}
            >
              <Chip.Label>{getCategoryName(cat, locale)}</Chip.Label>
            </Chip.Root>
          </Link>
        )
      })}
    </div>
  )
}

