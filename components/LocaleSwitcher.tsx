'use client'

import { useRouter } from 'next/navigation'
import { LOCALE_COOKIE } from '@/lib/i18n'
import type { Locale } from '@/lib/types'
import { Button } from '@heroui/react'

interface Props {
  currentLocale: Locale
}

export default function LocaleSwitcher({ currentLocale }: Props) {
  const router = useRouter()

  function switchLocale(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    router.refresh()
  }

  const isArabic = currentLocale === 'ar'

  return (
    <Button
      size="sm"
      variant="outline"
      onPress={() => switchLocale(isArabic ? 'en' : 'ar')}
      className="h-10 min-w-10 rounded-none border border-[#e5e5e5] dark:border-[#282522] bg-white dark:bg-[#171513] px-3.5 text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#ffffff] hover:border-[#d47f31] hover:text-[#d47f31] transition-all cursor-pointer"
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="font-semibold">{isArabic ? 'EN' : 'عربي'}</span>
    </Button>
  )
}
