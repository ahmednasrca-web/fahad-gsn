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
  iconSize = 36,
  showSubtitle = false,
}: LogoProps) {
  const isDarkBg = theme === 'dark'
  const textColor = isDarkBg ? 'text-[#FAF7F2]' : 'text-[#1A1209]'
  const subColor = isDarkBg ? 'text-[#D4B896]' : 'text-[#8A7968]'
  const iconColor = isDarkBg ? 'copper' : 'walnut'

  const content = (
    <div
      className={`flex items-center transition-opacity hover:opacity-90 ${
        variant === 'stacked' ? 'flex-col text-center gap-3' : 'gap-3'
      } ${className}`}
    >
      {/* Brand Mark */}
      <div
        className={`flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
          variant === 'stacked'
            ? 'h-16 w-16 bg-[#2C1810] shadow-md'
            : isDarkBg
            ? 'h-10 w-10 bg-white/10'
            : 'h-10 w-10 bg-[#2C1810]'
        }`}
      >
        <LogoIcon
          size={variant === 'stacked' ? 44 : iconSize}
          color={isDarkBg || variant === 'stacked' ? 'copper' : 'light'}
        />
      </div>

      {variant !== 'icon-only' && (
        <div className={`flex flex-col ${variant === 'stacked' ? 'items-center' : ''}`}>
          <span
            className={`font-bold font-display leading-none ${
              locale === 'ar' ? '' : variant === 'stacked' ? 'tracking-wider' : 'tracking-tight'
            } ${
              variant === 'stacked' ? 'text-2xl' : 'text-lg'
            } ${textColor}`}
          >
            {locale === 'ar' ? 'فهد غصن' : 'FAHAD GSN'}
          </span>
          {(showSubtitle || variant === 'stacked') && (
            <span
              className={`mt-1 font-medium ${
                locale === 'ar' ? 'font-sans text-[11px]' : 'tracking-widest uppercase ' + (variant === 'stacked' ? 'text-xs' : 'text-[10px]')
              } ${subColor}`}
            >
              {locale === 'ar' ? 'أعمال خشبية يدوية' : 'HANDCRAFTED FURNITURE'}
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
