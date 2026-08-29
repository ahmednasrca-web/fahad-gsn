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
      className="h-9 min-w-9 rounded-full border-[#E8DDD0] bg-white/80 px-3 text-xs font-bold text-[#3D2B1A] backdrop-blur-md shadow-2xs hover:border-[#C4854A] hover:bg-[#FAF7F2] transition-all"
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="font-semibold">{isArabic ? 'English' : 'العربية'}</span>
    </Button>
  )
}
