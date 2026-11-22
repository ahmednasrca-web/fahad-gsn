'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Work, Locale } from '@/lib/types'
import { getWorkTitle } from '@/lib/i18n'

interface Props {
  work: Work
  locale: Locale
}

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '96598908022'

export default function StickyVIPInquiryBar({ work, locale }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const isAr = locale === 'ar'
  const title = getWorkTitle(work, locale)

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `السلام عليكم أستاذ فهد، أود الاستفسار وحجز القطعة الحصرية:\n*${work.titleAr}*\nالسعر: ${work.price ? `${work.price} د.ك` : 'حسب التخصيص'}\nالرابط: ${typeof window !== 'undefined' ? window.location.href : ''}`
      : `Hello Fahad, I would like to inquire about reserving this bespoke piece:\n*${work.titleEn || work.titleAr}*\nPrice: ${work.price ? `${work.price} KWD` : 'Custom'}`
  )

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${whatsappMessage}`

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 bg-[#fcfbf9]/95 dark:bg-[#161412]/95 backdrop-blur-md border-t border-[#e8e5df] dark:border-[#2d2822] shadow-lg transition-all duration-300 text-[#181614] dark:text-[#fbf9f6]"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="container-site py-3 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Thumbnail & Info */}
          <div className="flex items-center gap-3 min-w-0">
            {work.primaryImage && (
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden border border-[#e8e5df] dark:border-[#353029] bg-[#f5f3ef] dark:bg-[#23201c]">
                <Image
                  src={work.primaryImage}
                  alt={title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {work.isUniquePiece && (
                  <span className="hidden sm:inline-flex furnish-badge">
                    {isAr ? 'قطعة فريدة' : 'Unique Piece'}
                  </span>
                )}
                <h4 className="truncate text-xs sm:text-sm font-bold text-[#181614] dark:text-[#fbf9f6]">
                  {title}
                </h4>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                {work.price != null ? (
                  <span className="text-xs sm:text-sm font-bold text-[#d47f31] font-mono">
                    <bdi>{work.price.toLocaleString(isAr ? 'ar-KW' : 'en-KW')}</bdi> <span>{isAr ? 'د.ك' : 'KWD'}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-[#5c544a] dark:text-[#d0c9bf]">
                    {isAr ? 'حسب المواصفات' : 'Custom Pricing'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Share / Copy Link Button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center border border-[#e8e5df] dark:border-[#353029] bg-white dark:bg-[#23201c] text-[#181614] dark:text-[#fbf9f6] hover:border-[#d47f31] transition-colors"
              title={isAr ? 'مشاركة رابط القطعة' : 'Share piece'}
              aria-label={isAr ? 'مشاركة' : 'Share'}
            >
              {copied ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              )}
            </button>

            {/* Direct WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-furnish-primary text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>{isAr ? 'حجز عبر واتساب' : 'Inquire on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
