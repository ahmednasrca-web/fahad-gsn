'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
  const [isLoupeEnabled, setIsLoupeEnabled] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, px: 0, py: 0 })
  const [zoomLevel, setZoomLevel] = useState<2.5 | 3.5 | 5>(3.5)
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width) * 100
    const yPct = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({
      x: Math.max(0, Math.min(100, xPct)),
      y: Math.max(0, Math.min(100, yPct)),
      px: e.clientX - rect.left,
      py: e.clientY - rect.top,
    })
  }, [])

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
      {/* Primary Interactive Image with Macro 4K Loupe & Lighting Atmosphere */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsFullscreen(true)}
        className={`group relative mb-3 aspect-work-hero w-full overflow-hidden rounded-3xl border border-[#E8DDD0] shadow-sm select-none transition-colors duration-500 cursor-crosshair ${activeConfig.containerBg}`}
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
          className="object-cover transition-all duration-500"
          style={{
            filter: activeConfig.filter,
          }}
          priority={activeIndex === 0}
        />

        {/* Ambient Lighting Shader Overlay */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${activeConfig.overlayGradient}`}
          aria-hidden="true"
        />

        {/* ── 4K Macro Grain Loupe Magnifier Lens (Active when hovering or toggled) ── */}
        {(isLoupeEnabled || isHovering) && (
          <div
            className="pointer-events-none absolute z-30 hidden sm:block h-48 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-3 border-[#C4854A] bg-black shadow-[0_0_40px_rgba(196,133,74,0.6)]"
            style={{
              left: `${mousePos.px}px`,
              top: `${mousePos.py}px`,
            }}
          >
            {/* Magnified Image */}
            <div
              className="absolute h-full w-full"
              style={{
                backgroundImage: `url(${current})`,
                backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: 'no-repeat',
                filter: activeConfig.filter,
              }}
            />

            {/* Precision Crosshair Reticle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="h-px w-full bg-[#C4854A]" />
              <div className="absolute h-full w-px bg-[#C4854A]" />
              <div className="absolute h-10 w-10 rounded-full border border-[#C4854A]" />
            </div>

            {/* Loupe Badge */}
            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="rounded-full bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-[#E8DDD0] border border-[#C4854A]/40 shadow-sm">
                4K MACRO · {zoomLevel}X
              </span>
            </div>
          </div>
        )}

        {/* Top Floating Badge: Macro Loupe Indicator */}
        <div className="absolute top-3 start-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/20 shadow-md transition-opacity">
          <span>🔍</span>
          <span>{isAr ? 'عدسة فحص العروق 4K' : '4K Macro Grain Lens'}</span>
        </div>

        {/* Current Lighting Mode Pill on Image */}
        <div className="absolute bottom-3 start-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/15 shadow-sm">
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
          className="absolute top-3 end-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-md transition-all hover:scale-110 hover:bg-black/90"
          aria-label={isAr ? 'عرض ملء الشاشة' : 'Fullscreen view'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
              className="absolute start-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#1A1209] shadow-xl backdrop-blur-sm transition-all hover:scale-105 hover:bg-white disabled:opacity-30 border border-[#E8DDD0]"
              aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setActiveIndex((i) => Math.min(images.length - 1, i + 1))
              }}
              disabled={activeIndex === images.length - 1}
              className="absolute end-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#1A1209] shadow-xl backdrop-blur-sm transition-all hover:scale-105 hover:bg-white disabled:opacity-30 border border-[#E8DDD0]"
              aria-label={isAr ? 'الصورة التالية' : 'Next image'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Image count */}
        {images.length > 1 && (
          <span className="absolute bottom-3 end-3 rounded-full bg-black/70 px-3 py-1 text-xs font-mono font-bold text-white backdrop-blur-sm border border-white/15">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* ── Interactive Atelier Controls Bar: Macro Zoom Level & Day/Night Atmosphere ── */}
      <div className="mb-4 rounded-2xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#150D08] p-3.5 shadow-sm transition-colors duration-400">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Zoom Level Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2] flex items-center gap-1.5">
              <span>🔬</span>
              <span>{isAr ? 'قوة تكبير العدسة:' : 'Macro Loupe Power:'}</span>
            </span>
            <div className="flex items-center gap-1 rounded-xl bg-white dark:bg-[#1E130B] p-1 border border-[#E8DDD0] dark:border-[#2C1B10]">
              {([2.5, 3.5, 5] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setZoomLevel(lvl)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                    zoomLevel === lvl
                      ? 'bg-[#C4854A] text-white shadow-sm'
                      : 'text-[#6B5C4E] dark:text-[#D4B896] hover:bg-[#F5F0E8] dark:hover:bg-[#2A1B10]'
                  }`}
                >
                  {lvl}X
                </button>
              ))}
            </div>
          </div>

          {/* 3 Atmosphere Mode Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2] flex items-center gap-1.5">
              <span>💡</span>
              <span>{isAr ? 'محاكي الإضاءة:' : 'Atmosphere:'}</span>
            </span>
            <div className="flex items-center gap-1 rounded-xl bg-white dark:bg-[#1E130B] p-1 border border-[#E8DDD0] dark:border-[#2C1B10]">
              {(['day', 'warm', 'night'] as const).map((mode) => {
                const cfg = lightingConfigs[mode]
                const isSelected = lightingMode === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLightingMode(mode)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2C1810] dark:bg-[#C4854A] text-[#FAF7F2] shadow-sm'
                        : 'text-[#6B5C4E] dark:text-[#D4B896] hover:bg-[#F5F0E8] dark:hover:bg-[#2A1B10] hover:text-[#1A1209] dark:hover:text-[#FAF7F2]'
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
        </div>

        {/* Atmosphere explanation */}
        <p className="mt-2 text-[11px] font-medium text-[#6B5C4E] dark:text-[#D4B896] leading-relaxed">
          {isAr ? activeConfig.descAr : activeConfig.descEn} · {isAr ? 'حرّك الماوس فوق الصورة لفحص تفاصيل الألياف والمسام بدقة 4K.' : 'Hover over image to inspect micro wood fibers in 4K.'}
        </p>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition-all ${
                i === activeIndex
                  ? 'border-[#C4854A] ring-2 ring-[#C4854A] ring-offset-2 scale-105 shadow-md'
                  : 'border-[#E8DDD0] opacity-65 hover:opacity-100'
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 end-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition z-50 text-xl border border-white/20"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            ✕
          </button>

          {/* Top Bar Lighting Switcher in Fullscreen */}
          <div
            className="absolute top-5 start-5 z-50 flex items-center gap-1.5 rounded-2xl bg-black/80 p-1.5 backdrop-blur-md border border-white/20"
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
                className="absolute start-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white hover:bg-[#C4854A] transition z-50 text-xl border border-white/20"
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
                className="absolute end-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white hover:bg-[#C4854A] transition z-50 text-xl border border-white/20"
                aria-label={isAr ? 'التالي' : 'Next'}
              >
                {isAr ? '◀' : '▶'}
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
