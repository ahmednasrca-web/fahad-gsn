'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
}

export default function WorkImageGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  if (images.length === 0) {
    return (
      <div className="flex aspect-work-hero w-full items-center justify-center rounded-2xl bg-[#F5F0E8] border border-[#E8DDD0]">
        <span className="text-6xl" aria-hidden="true">🪵</span>
      </div>
    )
  }

  const current = images[activeIndex]

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

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

  return (
    <div>
      {/* Primary Interactive Image with Wood Grain Magnifier */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsFullscreen(true)}
        className="group relative mb-3 aspect-work-hero w-full cursor-zoom-in overflow-hidden rounded-2xl bg-[#F5F0E8] border border-[#E8DDD0] shadow-sm select-none"
      >
        <Image
          key={current}
          src={current}
          alt={`${title} — ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-transform duration-300 ${
            isZooming ? 'scale-125' : 'scale-100'
          }`}
          style={
            isZooming
              ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : undefined
          }
          priority={activeIndex === 0}
        />

        {/* Magnifier Tip Badge */}
        <div className="absolute top-3 start-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
          <span>🔍</span>
          <span>تكبير تفاصيل الخشب</span>
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsFullscreen(true)
          }}
          className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          aria-label="عرض ملء الشاشة"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>

        {/* Arrow buttons (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex((i) => Math.max(0, i - 1))
              }}
              disabled={activeIndex === 0}
              className="absolute start-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white disabled:opacity-30"
              aria-label="الصورة السابقة"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex((i) => Math.min(images.length - 1, i + 1))
              }}
              disabled={activeIndex === images.length - 1}
              className="absolute end-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white disabled:opacity-30"
              aria-label="الصورة التالية"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Image count */}
        {images.length > 1 && (
          <span className="absolute bottom-3 end-3 rounded-full bg-black/60 px-3 py-1 text-xs font-mono font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border transition-all ${
                i === activeIndex
                  ? 'border-[#C4854A] ring-2 ring-[#C4854A] ring-offset-2 scale-105 shadow-sm'
                  : 'border-[#E8DDD0] opacity-60 hover:opacity-100'
              }`}
              aria-label={`صورة ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="72px"
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
          aria-label={`معاينة كاملة: ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 end-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-50 text-xl"
            aria-label="إغلاق"
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
                className="absolute start-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-50"
                aria-label="السابق"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i + 1) % images.length)
                }}
                className="absolute end-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-50"
                aria-label="التالي"
              >
                ▶
              </button>
            </>
          )}

          {/* Centered Large Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] aspect-4/3 w-full"
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

          <div className="absolute bottom-6 inset-x-0 text-center text-white text-xs font-mono">
            {title} ({activeIndex + 1} / {images.length})
          </div>
        </div>
      )}
    </div>
  )
}
