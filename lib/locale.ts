import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

// Server-side locale detection (for Server Components)
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value
  if (localeCookie === 'ar' || localeCookie === 'en') {
    return localeCookie
  }
  return DEFAULT_LOCALE
}
