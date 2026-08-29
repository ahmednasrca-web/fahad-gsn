'use client'

import { useRouter } from 'next/navigation'
import { LOCALE_COOKIE } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

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
    <button
      onClick={() => switchLocale(isArabic ? 'en' : 'ar')}
      className="flex h-9 items-center rounded-full border border-[#E8DDD0] bg-white/80 px-3 text-sm font-medium text-[#3D2B1A] backdrop-blur-sm transition hover:border-[#C4854A] hover:text-[#2C1810]"
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {isArabic ? 'EN' : 'ع'}
    </button>
  )
}
