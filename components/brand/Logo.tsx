import Link from 'next/link'
import LogoIcon from './LogoIcon'
import type { Locale } from '@/lib/types'

interface LogoProps {
  locale?: Locale
  variant?: 'horizontal' | 'stacked' | 'icon-only'
  theme?: 'light' | 'dark'
  href?: string
  className?: string
  iconSize?: number
  showSubtitle?: boolean
}

/**
 * Official Fahad Gsn Brand Logo Lockup.
 * Supports horizontal navbar mode, stacked footer/hero mode, and light/dark themes.
 */
export default function Logo({
  locale = 'ar',
  variant = 'horizontal',
  theme = 'light',
  href = '/',
  className = '',
  iconSize = 32,
  showSubtitle = true,
}: LogoProps) {
  const isDarkBg = theme === 'dark'
  const textColor = isDarkBg ? 'text-[#FAF7F2]' : 'text-[#11100e] dark:text-[#FAF7F2]'
  const subColor = 'text-[#d47f31]'

  const content = (
    <div
      className={`flex items-center transition-opacity hover:opacity-90 ${
        variant === 'stacked' ? 'flex-col text-center gap-3' : 'gap-3'
      } ${className}`}
    >
      {/* Brand Mark — Furnish Architectural Sharp Container */}
      <div
        className={`flex items-center justify-center rounded-none transition-transform duration-300 group-hover:scale-105 shrink-0 ${
          variant === 'stacked'
            ? 'h-14 w-14 bg-black text-white dark:bg-white dark:text-black shadow-sm'
            : isDarkBg
            ? 'h-9 w-9 bg-white/10 text-white'
            : 'h-9 w-9 bg-[#11100e] text-white dark:bg-white dark:text-black'
        }`}
      >
        <LogoIcon
          size={variant === 'stacked' ? 36 : iconSize}
          color={isDarkBg || variant === 'stacked' ? 'copper' : 'light'}
        />
      </div>

      {variant !== 'icon-only' && (
        <div className={`flex flex-col ${variant === 'stacked' ? 'items-center' : ''}`}>
          <span
            className={`font-bold font-display leading-none tracking-tight ${
              variant === 'stacked' ? 'text-2xl' : 'text-base'
            } ${textColor}`}
            style={locale !== 'ar' ? { letterSpacing: '0.12rem' } : undefined}
          >
            {locale === 'ar' ? 'فهد غصن' : 'FAHAD GSN'}
          </span>
          {(showSubtitle || variant === 'stacked') && (
            <span
              className={`mt-1 font-semibold text-[10px] uppercase leading-none tracking-widest ${subColor}`}
            >
              {locale === 'ar' ? 'تحف خشبية فاخرة' : 'FURNITURE & ATELIER'}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (!href) return content

  return (
    <Link href={href} aria-label="فهد غصن — الرئيسية" className="group inline-flex focus:outline-none">
      {content}
    </Link>
  )
}
