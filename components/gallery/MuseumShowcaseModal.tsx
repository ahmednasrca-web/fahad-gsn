'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Work, Locale } from '@/lib/types'
import { getWorkTitle, getWorkDescription, getCategoryName } from '@/lib/i18n'

interface Props {
  works: Work[]
  locale: Locale
}

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '96598908022'

export default function MuseumShowcaseModal({ works, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const isAr = locale === 'ar'

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % works.length)
  }, [works.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + works.length) % works.length)
  }, [works.length])

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
      if (e.key === 'ArrowRight') {
        if (isAr) handlePrev()
        else handleNext()
      }
      if (e.key === 'ArrowLeft') {
        if (isAr) handleNext()
        else handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, isAr, handleNext, handlePrev])

  if (works.length === 0) return null

  const current = works[currentIndex]
  const title = getWorkTitle(current, locale)
  const description = getWorkDescription(current, locale)

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `السلام عليكم أستاذ فهد، أود الاستفسار وحجز هذه القطعة المتحفية:\n*${current.titleAr}*\nالسعر: ${current.price ? `${current.price} د.ك` : 'حسب التخصيص'}`
      : `Hello Fahad, I would like to inquire about this museum piece:\n*${current.titleEn || current.titleAr}*`
  )

  return (
    <>
      {/* Trigger Button on Gallery Header */}
      <button
        type="button"
        onClick={() => {
          setCurrentIndex(0)
          setIsOpen(true)
        }}
        className="group inline-flex items-center gap-2.5 rounded-full bg-[#2C1810] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#FAF7F2] shadow-md border border-[#C4854A]/50 transition-all hover:scale-105 hover:bg-[#3D2316] hover:shadow-xl active:scale-95"
      >
        <span className="text-base transition-transform group-hover:scale-110">🏛️</span>
        <span>{isAr ? 'عرض المقتنيات المتحفي (Museum Mode)' : 'Museum Showcase Mode'}</span>
        <span className="rounded-full bg-[#C4854A]/30 px-2 py-0.5 font-mono text-[10px] text-[#E8DDD0] border border-[#C4854A]/40">
          {works.length} {isAr ? 'تحف' : 'Works'}
        </span>
      </button>

      {/* Fullscreen Museum Theater Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/96 backdrop-blur-2xl text-white p-4 sm:p-8 animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Top Bar */}
          <div className="relative z-30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#C4854A]/20 border border-[#C4854A]/50 px-3.5 py-1 text-xs font-bold text-[#D4B896] tracking-wider">
                🏛️ {isAr ? 'المعرض الرقمي الصامت' : 'Private Museum Showcase'}
              </span>
              <span className="font-mono text-xs text-[#A09080]">
                {currentIndex + 1} / {works.length}
              </span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl border border-white/20 shadow-xl transition-all hover:scale-110 hover:bg-white hover:text-black"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Center Stage: Artwork & Ambient Glow */}
          <div className="relative z-20 flex-1 flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl mx-auto w-full my-4">
            {/* Image Showcase */}
            <div className="relative w-full max-w-[550px] aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden border-2 border-white/15 bg-[#120B07] shadow-[0_0_80px_rgba(196,133,74,0.25)]">
              {current.primaryImage ? (
                <Image
                  src={current.primaryImage}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-all duration-700 animate-in fade-in zoom-in-98"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl text-[#D4B896]">🪵</span>
                </div>
              )}

              {current.isUniquePiece && (
                <span className="absolute top-4 start-4 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-[#C4854A] backdrop-blur-md border border-[#C4854A]/40 shadow-md">
                  💎 1 of 1 · {isAr ? 'قطعة فريدة غير مكررة' : 'Unique Piece'}
                </span>
              )}

              {current.category && (
                <span className="absolute bottom-4 start-4 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-[#FAF7F2] backdrop-blur-md border border-white/15">
                  {getCategoryName(current.category, locale)}
                </span>
              )}
            </div>

            {/* Artwork Story & Details */}
            <div className="w-full max-w-[480px] flex flex-col justify-center text-start">
              <span className="text-xs font-bold text-[#C4854A] tracking-widest font-display">
                {isAr ? 'مقتنيات محترف فهد غصن' : 'Fahad Gsn Atelier Haute Collection'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-[#FAF7F2] font-display leading-tight">
                {title}
              </h2>

              {description && (
                <p className="mt-4 text-sm sm:text-base text-[#D4B896] leading-relaxed line-clamp-4">
                  {description}
                </p>
              )}

              <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs text-[#A09080]">{isAr ? 'القيمة التقديرية' : 'Valuation'}</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#FAF7F2] font-mono mt-0.5">
                    {current.price != null
                      ? `${current.price.toLocaleString(isAr ? 'ar-KW' : 'en-KW')} ${isAr ? 'د.ك' : 'KWD'}`
                      : (isAr ? 'حسب التخصيص' : 'Bespoke')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/gallery/${current.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-[#FAF7F2] text-[#2C1810] hover:bg-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  {isAr ? 'معاينة التفاصيل الكاملة ←' : 'View Full Details →'}
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 border border-emerald-400/30 flex items-center gap-2"
                >
                  <span>💬</span>
                  <span>{isAr ? 'حجز القطعة عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Carousel Navigation */}
          <div className="relative z-30 flex items-center justify-between border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-[#C4854A] px-5 py-2 text-xs font-bold text-white transition-all backdrop-blur-md border border-white/15"
            >
              <span>{isAr ? '→' : '←'}</span>
              <span>{isAr ? 'التحفة السابقة' : 'Previous'}</span>
            </button>

            {/* Thumbnail dots / mini rail */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-md px-2">
              {works.map((w, idx) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-8 bg-[#C4854A]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to piece ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-[#C4854A] px-5 py-2 text-xs font-bold text-white transition-all backdrop-blur-md border border-white/15"
            >
              <span>{isAr ? 'التحفة التالية' : 'Next'}</span>
              <span>{isAr ? '←' : '→'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
