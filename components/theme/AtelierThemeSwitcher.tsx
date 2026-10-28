'use client'

import { useTheme } from './ThemeProvider'
import type { Locale } from '@/lib/types'
import { useAtelierAudio } from '@/components/interactive/AtelierHapticAudio'

interface Props {
  locale?: Locale
  showLabel?: boolean
  className?: string
}

export default function AtelierThemeSwitcher({
  locale = 'ar',
  showLabel = true,
  className = '',
}: Props) {
  const { isDark, toggleTheme } = useTheme()
  const { playSound } = useAtelierAudio()
  const isAr = locale === 'ar'

  function handleToggle() {
    playSound('tick')
    toggleTheme()
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group relative inline-flex h-10 items-center gap-2 rounded-none border border-[#ecebe9] dark:border-[#211f1c] bg-white dark:bg-[#11100e] px-3.5 text-xs font-bold shadow-2xs backdrop-blur-md transition-all duration-300 hover:border-[#d47f31] hover:text-[#d47f31] active:scale-95 cursor-pointer text-[#11100e] dark:text-[#f6f5f4] ${className}`}
      aria-label={
        isDark
          ? isAr ? 'التبديل إلى نهار الورشة (الوضع النهاري)' : 'Switch to Daylight Atelier'
          : isAr ? 'التبديل إلى سهرة الصالون (الوضع الليلي)' : 'Switch to Midnight Lounge'
      }
      aria-pressed={isDark}
      title={
        isDark
          ? isAr ? 'التبديل إلى نهار الورشة' : 'Switch to Daylight Atelier'
          : isAr ? 'التبديل إلى سهرة الصالون' : 'Switch to Midnight Lounge'
      }
    >
      {/* Bespoke Royal Atelier Luminary Icon Container */}
      <div className="relative flex h-5 w-5 items-center justify-center transition-transform duration-500 group-hover:rotate-12">
        {isDark ? (
          /* Gilded Crescent & Royal Lantern Icon (Midnight Mode) */
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#D4B896] transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(212,184,150,0.6)]"
            aria-hidden="true"
          >
            {/* Elegant Crescent */}
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(196, 133, 74, 0.25)"
            />
            {/* Gilded 4-Point Star Accent */}
            <path
              d="M18 5L18.8 6.8L20.6 7.6L18.8 8.4L18 10.2L17.2 8.4L15.4 7.6L17.2 6.8L18 5Z"
              fill="#D4B896"
            />
          </svg>
        ) : (
          /* Radiant 8-Facet Sol Gemstone Icon (Daylight Mode) */
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#C4854A] transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(196,133,74,0.5)]"
            aria-hidden="true"
          >
            {/* Central Diamond Core */}
            <circle
              cx="12"
              cy="12"
              r="4.5"
              stroke="currentColor"
              strokeWidth="2"
              fill="rgba(196, 133, 74, 0.2)"
            />
            {/* 8 Geometric Architectural Rays */}
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Mode Label */}
      {showLabel && (
        <span className="text-[11px] font-bold text-[#3D2B1A] dark:text-[#E8DDD0] transition-colors">
          {isDark
            ? isAr ? 'سهرة الصالون' : 'Midnight'
            : isAr ? 'نهار الورشة' : 'Daylight'}
        </span>
      )}
    </button>
  )
}
