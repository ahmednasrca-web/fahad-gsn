'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/types'

interface Props {
  locale?: Locale
  className?: string
  rawImage?: string
  finishedImage?: string
  woodName?: string
  rawLabel?: string
  finishedLabel?: string
}

export default function WoodTransformationSlider({
  locale = 'ar',
  className = '',
  rawImage = 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=1200&auto=format&fit=crop', // raw tree slab
  finishedImage = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200&auto=format&fit=crop', // finished handcrafted wood table
  woodName,
  rawLabel,
  finishedLabel,
}: Props) {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isAr = locale === 'ar'

  const actualRawLabel = rawLabel ?? (isAr ? 'الجذع الخام قبل المعالجة' : 'Raw Untreated Wood Slab')
  const actualFinishedLabel = finishedLabel ?? (isAr ? 'التحفة بعد التشكيل والتشطيب الملكي' : 'Handcrafted Masterpiece')
  const actualWoodName = woodName ?? (isAr ? 'خشب الجوز الأمريكي المعمر' : 'American Black Walnut')

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percentage)
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }, [isDragging, handleMove])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }, [isDragging, handleMove])

  const handleStopDrag = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleStopDrag)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleStopDrag)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleStopDrag)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleStopDrag)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleStopDrag])

  return (
    <div className={`overflow-hidden rounded-3xl border border-[#E8DDD0] bg-[#FAF7F2] p-6 sm:p-10 shadow-sm ${className}`}>
      {/* Header */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
          {isAr ? 'رحلة التحول الحرفي' : 'The Transformation Journey'}
        </span>
        <h2 className="mt-2 text-2xl font-bold text-[#1A1209] md:text-3xl">
          {isAr ? 'من الجذع الخام إلى التحفة الفنية' : 'From Raw Trunk to Masterpiece'}
        </h2>
        <p className="mt-2 text-sm text-[#6B5C4E] leading-relaxed">
          {isAr
            ? `اسحب المقبض لتكتشف كيف تتحول شريحة ${actualWoodName} عبر مئات ساعات الصنفرة والزيوت العضوية إلى قطعة أثاث خالدة.`
            : `Drag the slider to see how ${actualWoodName} evolves through meticulous hand-shaping and organic oils.`}
        </p>
      </div>

      {/* Interactive Dual-Layer Slider */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true)
          handleMove(e.clientX)
        }}
        onTouchStart={(e) => {
          setIsDragging(true)
          handleMove(e.touches[0].clientX)
        }}
        className="relative aspect-16/9 sm:aspect-21/9 w-full select-none overflow-hidden rounded-2xl border border-[#E8DDD0] bg-[#2C1810] cursor-ew-resize shadow-md"
      >
        {/* Base Layer: Finished Masterpiece */}
        <div className="absolute inset-0">
          <Image
            src={finishedImage}
            alt={actualFinishedLabel}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
          {/* Badge Finished */}
          <div className="absolute bottom-4 end-4 rounded-full bg-[#2C1810]/85 px-4 py-1.5 text-xs font-bold text-[#FAF7F2] backdrop-blur-md border border-[#C4854A]/40 shadow-lg">
            <span>{actualFinishedLabel}</span>
          </div>
        </div>

        {/* Top Clipped Layer: Raw Wood Slab */}
        <div
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
          style={{
            clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`,
          }}
        >
          <Image
            src={rawImage}
            alt={actualRawLabel}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
          {/* Badge Raw */}
          <div className="absolute top-4 start-4 rounded-full bg-black/75 px-4 py-1.5 text-xs font-bold text-[#D4B896] backdrop-blur-md border border-white/20 shadow-lg">
            <span>{actualRawLabel}</span>
          </div>
        </div>

        {/* Slider Handle Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-[#FAF7F2] via-[#C4854A] to-[#FAF7F2] shadow-[0_0_12px_rgba(196,133,74,0.8)] will-change-[left]"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Center Grab Handle Button */}
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#2C1810] border-2 border-[#C4854A] shadow-2xl text-[#FAF7F2] transition-transform duration-150 hover:scale-110 active:scale-95">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 3 12 9 6" className="-translate-x-1" />
              <polyline points="9 18 15 12 9 6" className="translate-x-3 rotate-180" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer Info / Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 text-center border-t border-[#E8DDD0] pt-6">
        <div>
          <p className="text-2xl font-bold text-[#2C1810]">100%</p>
          <p className="text-xs text-[#8A7968]">{isAr ? 'خشب طبيعي مستدام' : 'Sustainable Solid Hardwood'}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#2C1810]">3 {isAr ? 'سنوات' : 'Years'}</p>
          <p className="text-xs text-[#8A7968]">{isAr ? 'فترة التجفيف الهوائي' : 'Air-Kiln Curing Process'}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#2C1810]">120+</p>
          <p className="text-xs text-[#8A7968]">{isAr ? 'ساعة صنفرة وتشكيل' : 'Handcrafting Hours'}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#2C1810]">0%</p>
          <p className="text-xs text-[#8A7968]">{isAr ? 'كيماويات ضارة (Organic)' : 'Zero Toxic Chemicals'}</p>
        </div>
      </div>
    </div>
  )
}
