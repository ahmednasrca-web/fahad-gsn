'use client'

import { useEffect, useCallback } from 'react'
import type { Reel, Locale } from '@/lib/types'
import { PROVIDER_META, getSafeEmbedUrl, getSafeWatchUrl } from '@/lib/reels/providers'
import { getReelTitle, getReelDescription } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  reel: Reel | null
  locale: Locale
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}

export default function ReelLightboxModal({
  isOpen,
  onClose,
  reel,
  locale,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: Props) {
  const isAr = locale === 'ar'

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') {
      if (isAr) { hasNext && onNext?.() } else { hasPrev && onPrev?.() }
    }
    if (e.key === 'ArrowRight') {
      if (isAr) { hasPrev && onPrev?.() } else { hasNext && onNext?.() }
    }
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext, isAr])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !reel) return null

  const meta = PROVIDER_META[reel.provider]
  const title = getReelTitle(reel, locale)
  const description = getReelDescription(reel, locale)
  const embedUrl = getSafeEmbedUrl(reel.provider, reel.contentId, reel.originalUrl)
  const watchUrl = getSafeWatchUrl(reel.provider, reel.contentId, reel.originalUrl)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Background click to close */}
      <div
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Top Controls Bar */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/15 shadow-md">
            <span>{meta?.icon ?? '📸'}</span>
            <span>{isAr ? meta?.nameAr : meta?.name}</span>
          </span>
          {reel.isFeatured && (
            <span className="rounded-full bg-[#C4854A] px-3 py-1 text-xs font-bold text-white shadow-md">
              ⭐ {isAr ? 'كواليس مميزة' : 'Featured'}
            </span>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl border border-white/20 shadow-xl transition-all hover:scale-110 hover:bg-white hover:text-black focus:outline-none"
          aria-label={isAr ? 'إغلاق المقطع' : 'Close video'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Arrows (Desktop) */}
      {hasPrev && (
        <button
          type="button"
          onClick={onPrev}
          className={`hidden sm:flex absolute start-6 z-30 h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:scale-110 hover:bg-[#C4854A] hover:border-[#C4854A]`}
          aria-label={isAr ? 'المقطع السابق' : 'Previous video'}
        >
          <span className="text-xl">{isAr ? '→' : '←'}</span>
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={onNext}
          className={`hidden sm:flex absolute end-6 z-30 h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:scale-110 hover:bg-[#C4854A] hover:border-[#C4854A]`}
          aria-label={isAr ? 'المقطع التالي' : 'Next video'}
        >
          <span className="text-xl">{isAr ? '←' : '→'}</span>
        </button>
      )}

      {/* Center Cinematic Theater Card */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[420px] max-h-[90vh]">
        {/* The Frame */}
        <div className="relative w-full aspect-[9/16] max-h-[75vh] sm:max-h-[78vh] overflow-hidden rounded-3xl border-2 border-white/15 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full border-0 rounded-3xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="eager"
          />
        </div>

        {/* Modal Bottom Information & Action */}
        <div className="mt-4 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-white px-2">
          <div className="text-center sm:text-start flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#FAF7F2] truncate drop-shadow-sm font-display">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#D4B896] truncate mt-0.5">
                {description}
              </p>
            )}
          </div>

          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[#fd1d1d]/40 active:scale-95"
          >
            <span>{isAr ? 'شاهد وتفاعل على إنستغرام' : 'Open in Instagram'}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
