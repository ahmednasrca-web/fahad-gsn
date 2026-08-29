'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

type LightingMode = 'day' | 'warm' | 'night'

interface Props {
  images: string[]
  title: string
  locale?: string
}

export default function WorkImageGallery({ images, title, locale = 'ar' }: Props) {
  const isAr = locale === 'ar'
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lightingMode, setLightingMode] = useState<LightingMode>('day')
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

  // Lighting mode visual configurations
  const lightingConfigs: Record<LightingMode, {
    labelAr: string
    labelEn: string
    temp: string
    icon: string
    descAr: string
    descEn: string
    filter: string
    containerBg: string
    overlayGradient: string
    glowColor: string
  }> = {
    day: {
      labelAr: 'ضوء نهار طبيعي',
      labelEn: 'Natural Daylight',
      temp: '5500K',
      icon: '☀️',
      descAr: 'يحاكي ضوء الشمس الطبيعي ليوضح الألوان الحقيقية للخشب ودقة الألياف.',
      descEn: 'Simulates pure natural daylight, revealing true wood tones and crisp grain.',
      filter: 'none',
      containerBg: 'bg-[#F5F0E8]',
      overlayGradient: 'opacity-0',
      glowColor: 'rgba(250, 247, 242, 0.2)',
    },
    warm: {
      labelAr: 'إضاءة صالون دافئة',
      labelEn: 'Warm Chandelier Glow',
      temp: '2700K',
      icon: '💡',
      descAr: 'إضاءة المساء الدافئة في المجالس والصالونات، تبرز لمعان الزيوت العضوية وبريق العروق.',
      descEn: 'Warm majlis & living ambience, enhancing organic oil luster and rich timber depth.',
      filter: 'sepia(0.24) brightness(0.96) contrast(1.06) saturate(1.22)',
      containerBg: 'bg-[#23150D]',
      overlayGradient: 'opacity-100 bg-gradient-to-t from-[#3A1E0B]/40 via-transparent to-[#D4854A]/15 mix-blend-soft-light',
      glowColor: 'rgba(212, 133, 74, 0.4)',
    },
    night: {
      labelAr: 'أجواء سهرة خافتة',
      labelEn: 'Intimate Night Mood',
      temp: '2000K',
      icon: '🌙',
      descAr: 'إضاءة ليلية سينمائية هادئة مع تسليط ضوء مركز يُظهر هيبة القطعة وفخامة ظلالها.',
      descEn: 'Cinematic intimate lighting with dramatic shadows and spotlight prestige.',
      filter: 'sepia(0.38) brightness(0.78) contrast(1.22) saturate(1.25)',
      containerBg: 'bg-[#120B07]',
      overlayGradient: 'opacity-100 bg-[radial-gradient(circle_at_50%_35%,rgba(255,185,115,0.25),rgba(10,5,2,0.85)_80%)] mix-blend-soft-light',
      glowColor: 'rgba(196, 133, 74, 0.25)',
    },
  }

  const activeConfig = lightingConfigs[lightingMode]

  return (
    <div>
      {/* Primary Interactive Image with Wood Grain Magnifier & Lighting Atmosphere */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsFullscreen(true)}
        className={`group relative mb-3 aspect-work-hero w-full cursor-zoom-in overflow-hidden rounded-3xl border border-[#E8DDD0] shadow-sm select-none transition-colors duration-500 ${activeConfig.containerBg}`}
        style={{
          boxShadow: lightingMode !== 'day' ? `0 10px 30px -10px ${activeConfig.glowColor}` : undefined,
        }}
      >
        <Image
          key={`${current}-${lightingMode}`}
          src={current}
          alt={`${title} — ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-all duration-500 ease-out ${
            isZooming ? 'scale-125' : 'scale-100'
          }`}
          style={{
            filter: activeConfig.filter,
            transformOrigin: isZooming ? `${zoomPos.x}% ${zoomPos.y}%` : undefined,
          }}
          priority={activeIndex === 0}
        />

        {/* Ambient Lighting Shader Overlay */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${activeConfig.overlayGradient}`}
          aria-hidden="true"
        />

        {/* Magnifier Tip Badge */}
        <div className="absolute top-3 start-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
          <span>🔍</span>
          <span>{isAr ? 'تكبير تفاصيل الخشب' : 'Zoom Wood Details'}</span>
        </div>

        {/* Current Lighting Mode Pill on Image */}
        <div className="absolute bottom-3 start-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/15">
          <span>{activeConfig.icon}</span>
          <span className="font-mono text-[#D4B896]">{activeConfig.temp}</span>
          <span className="text-white/80">·</span>
          <span>{isAr ? activeConfig.labelAr : activeConfig.labelEn}</span>
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsFullscreen(true)
          }}
          className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          aria-label={isAr ? 'عرض ملء الشاشة' : 'Fullscreen view'}
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
              aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
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
              aria-label={isAr ? 'الصورة التالية' : 'Next image'}
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

      {/* ── Day & Night Atmosphere Lighting Switcher Bar ── */}
      <div className="mb-4 rounded-2xl border border-[#E8DDD0] bg-[#FAF7F2] p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C1810] text-xs text-[#FAF7F2]">
              💡
            </span>
            <span className="text-xs font-bold text-[#1A1209]">
              {isAr ? 'محاكي إضاءة الغرفة:' : 'Room Atmosphere Simulator:'}
            </span>
          </div>

          {/* 3 Atmosphere Mode Buttons */}
          <div className="flex items-center gap-1.5 rounded-xl bg-white p-1 border border-[#E8DDD0]">
            {(['day', 'warm', 'night'] as const).map((mode) => {
              const cfg = lightingConfigs[mode]
              const isSelected = lightingMode === mode
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLightingMode(mode)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#2C1810] text-[#FAF7F2] shadow-sm'
                      : 'text-[#6B5C4E] hover:bg-[#F5F0E8] hover:text-[#1A1209]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-xs">{cfg.icon}</span>
                  <span className="hidden xs:inline">{isAr ? cfg.labelAr : cfg.labelEn}</span>
                  <span className="font-mono text-[10px] opacity-75">{cfg.temp}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Atmosphere Description */}
        <p className="mt-2 text-[11px] text-[#8A7968] leading-relaxed transition-opacity duration-300">
          {isAr ? activeConfig.descAr : activeConfig.descEn}
        </p>
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
              aria-label={isAr ? `صورة ${i + 1}` : `Image ${i + 1}`}
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

      {/* Fullscreen Lightbox Modal with Atmosphere Support */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${isAr ? 'معاينة كاملة' : 'Fullscreen preview'}: ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 end-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition z-50 text-xl"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            ✕
          </button>

          {/* Top Bar Lighting Switcher in Fullscreen */}
          <div
            className="absolute top-5 start-5 z-50 flex items-center gap-1.5 rounded-2xl bg-black/70 p-1.5 backdrop-blur-md border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {(['day', 'warm', 'night'] as const).map((mode) => {
              const cfg = lightingConfigs[mode]
              const isSelected = lightingMode === mode
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLightingMode(mode)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#C4854A] text-white shadow-md'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span>{isAr ? cfg.labelAr : cfg.labelEn}</span>
                  <span className="font-mono text-[10px] opacity-75">{cfg.temp}</span>
                </button>
              )
            })}
          </div>

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
                aria-label={isAr ? 'السابق' : 'Previous'}
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
                aria-label={isAr ? 'التالي' : 'Next'}
              >
                ▶
              </button>
            </>
          )}

          {/* Centered Large Image with active lighting shader */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] aspect-4/3 w-full transition-all duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current}
              alt={`${title} — ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain transition-all duration-500"
              style={{
                filter: activeConfig.filter,
              }}
              priority
            />
          </div>

          <div className="absolute bottom-6 inset-x-0 text-center text-white text-xs font-mono">
            {title} ({activeIndex + 1} / {images.length}) · {activeConfig.temp} {isAr ? activeConfig.labelAr : activeConfig.labelEn}
          </div>
        </div>
      )}
    </div>
  )
}
