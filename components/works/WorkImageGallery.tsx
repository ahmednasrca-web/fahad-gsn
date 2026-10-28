'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
  locale?: string
}

export default function WorkImageGallery({ images, title, locale = 'ar' }: Props) {
  const isAr = locale === 'ar'
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    if (!isFullscreen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsFullscreen(false)
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, images.length])

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] sm:aspect-square w-full items-center justify-center bg-[#ecebe9] dark:bg-[#181614] border border-[#ecebe9] dark:border-[#211f1c]">
        <span className="text-4xl text-[#d47f31]">🪵</span>
      </div>
    )
  }

  const current = images[activeIndex]

  return (
    <div>
      {/* Primary Image Viewport */}
      <div
        onClick={() => setIsFullscreen(true)}
        className="group relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-[#ecebe9] dark:bg-[#181614] border border-[#ecebe9] dark:border-[#211f1c] select-none cursor-pointer"
      >
        <Image
          key={current}
          src={current}
          alt={`${title} — ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          priority={activeIndex === 0}
        />

        {/* Subtle Zoom Cue Pill */}
        <div className="absolute bottom-3 start-3 flex items-center gap-1.5 bg-black/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <span>{isAr ? 'اضغط للمعاينة المكبرة' : 'Click to enlarge'}</span>
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsFullscreen(true)
          }}
          className="absolute top-3 end-3 flex h-9 w-9 items-center justify-center bg-black/75 text-white hover:bg-black transition-colors"
          aria-label={isAr ? 'عرض ملء الشاشة' : 'Fullscreen view'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3 end-3 bg-black/75 px-2.5 py-1 text-[11px] font-mono text-white">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden border transition-all ${
                i === activeIndex
                  ? 'border-2 border-[#d47f31] opacity-100'
                  : 'border-[#ecebe9] dark:border-[#211f1c] opacity-60 hover:opacity-100'
              }`}
              aria-label={isAr ? `صورة ${i + 1}` : `Image ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${isAr ? 'معاينة كاملة' : 'Fullscreen preview'}: ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 end-5 flex h-11 w-11 items-center justify-center bg-white/10 text-white hover:bg-white hover:text-black transition-colors z-50 text-xl"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            ✕
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i - 1 + images.length) % images.length)
                }}
                className="absolute start-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-white/10 text-white hover:bg-[#d47f31] hover:text-white transition-colors z-50 text-xl"
                aria-label={isAr ? 'السابق' : 'Previous'}
              >
                {isAr ? '▶' : '◀'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i + 1) % images.length)
                }}
                className="absolute end-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center bg-white/10 text-white hover:bg-[#d47f31] hover:text-white transition-colors z-50 text-xl"
                aria-label={isAr ? 'التالي' : 'Next'}
              >
                {isAr ? '◀' : '▶'}
              </button>
            </>
          )}

          {/* Centered Large Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] aspect-[4/3] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current}
              alt={`${title} — ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-6 inset-x-0 text-center text-white/80 text-xs font-mono">
            {title} ({activeIndex + 1} / {images.length})
          </div>
        </div>
      )}
    </div>
  )
}
