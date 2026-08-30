'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/types'

interface TransformationItem {
  id: string
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  rawImage: string
  finishedImage: string
  rawLabelAr: string
  rawLabelEn: string
  finishedLabelAr: string
  finishedLabelEn: string
  woodSpeciesAr: string
  woodSpeciesEn: string
  stats: {
    purity: string
    curing: string
    curingAr: string
    hours: string
    hoursAr: string
    eco: string
    ecoAr: string
  }
}

const PRESETS: TransformationItem[] = [
  {
    id: 'walnut-table',
    nameAr: 'طاولة طعام الجوز الأسود الملكية',
    nameEn: 'Royal Black Walnut Dining Table',
    descAr: 'شاهد تحول شريحة الجوز الأمريكي المعمرة من جذع طبيعي خشن بحواف اللحاء إلى سطح أملس مصقول بدهان الزيوت العضوية الإيطالية.',
    descEn: 'See how raw American Black Walnut evolves from a rough bark slab into a silky polished heirloom surface seasoned with organic Italian oils.',
    rawImage: '/transformation/raw-walnut.jpg',
    finishedImage: '/transformation/finished-walnut.jpg',
    rawLabelAr: 'لوح الجوز الخام قبل التشكيل والقص',
    rawLabelEn: 'Raw Uncut Walnut Slab',
    finishedLabelAr: 'التحفة بعد الصنفرة والتشطيب الملكي',
    finishedLabelEn: 'Finished Masterpiece with Organic Oil',
    woodSpeciesAr: 'جوز أسود أمريكي معمر (American Walnut)',
    woodSpeciesEn: 'Aged American Black Walnut',
    stats: {
      purity: '100%',
      curing: '3 Years',
      curingAr: '3 سنوات تجفيف طبيعي',
      hours: '140+ Hours',
      hoursAr: '140+ ساعة عمل يدوي',
      eco: '0% Chemicals',
      ecoAr: '0% كيماويات (زيوت عضوية)',
    }
  },
  {
    id: 'burl-coffee',
    nameAr: 'طاولة قهوة من عقدة جذر السنديان',
    nameEn: 'Organic Burl Oak Coffee Table',
    descAr: 'كيف تتحول عقدة جذر السنديان المتعرجة المستخرجة من باطن الأرض إلى قطعة مركزية فريدة تبرز كل تفصيلة طبيعية.',
    descEn: 'Witness how subterranean oak burl clusters are transformed into an organic centerpiece highlighting intricate natural topology.',
    rawImage: '/transformation/raw-burl.jpg',
    finishedImage: '/transformation/finished-burl.jpg',
    rawLabelAr: 'كتلة الجذر المتعرجة قبل النحت',
    rawLabelEn: 'Subterranean Raw Burl Cluster',
    finishedLabelAr: 'طاولة القهوة بعد النحت والتنعيم الحريري',
    finishedLabelEn: 'Silk-Smooth Sculpted Coffee Table',
    woodSpeciesAr: 'عقدة جذر سنديان معمر (European Oak Burl)',
    woodSpeciesEn: 'Ancient European Oak Burl',
    stats: {
      purity: '100%',
      curing: '5 Years',
      curingAr: '5 سنوات تجفيف دقيق',
      hours: '95+ Hours',
      hoursAr: '95+ ساعة تشكيل يدوي',
      eco: '100% Organic',
      ecoAr: 'شمع عسل طبيعي 100%',
    }
  },
  {
    id: 'resin-table',
    nameAr: 'طاولة الراتنج الكريستالي الدخاني',
    nameEn: 'Smoked Amber Crystal Resin Table',
    descAr: 'دمج الشقوق الطبيعية بأطراف الخشب مع الراتنج النقي لتشكيل نهر كريستالي انسيابي فائق الشفافية والصلابة.',
    descEn: 'Fusing organic wood fissures with crystal-clear amber casting resin to forge a fluid, enduring river table.',
    rawImage: '/transformation/raw-resin.jpg',
    finishedImage: '/transformation/finished-resin.jpg',
    rawLabelAr: 'لوح الخشب مع التجاويف الطبيعية',
    rawLabelEn: 'Raw Slab with Organic Voids',
    finishedLabelAr: 'التحفة بعد صب الراتنج والصقل الزجاجي',
    finishedLabelEn: 'Crystal Polished Resin River Table',
    woodSpeciesAr: 'سنديان مطعم براتنج عنبري (Oak & Resin)',
    woodSpeciesEn: 'Oak & Smoked Amber Resin',
    stats: {
      purity: 'High Clar.',
      curing: '48 Hours',
      curingAr: '48 ساعة تبريد راتنج',
      hours: '120+ Hours',
      hoursAr: '120+ ساعة صقل وتلميع',
      eco: 'Food Safe',
      ecoAr: 'آمن للغذاء والاستخدام اليومي',
    }
  }
]

interface Props {
  locale?: Locale
  className?: string
}

export default function WoodTransformationSlider({
  locale = 'ar',
  className = '',
}: Props) {
  const [activePresetIndex, setActivePresetIndex] = useState(0)
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isAr = locale === 'ar'

  const current = PRESETS[activePresetIndex]

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
    <div className={`overflow-hidden rounded-3xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] p-6 sm:p-10 shadow-sm transition-colors duration-400 ${className}`}>
      {/* Section Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
          {isAr ? 'رحلة التحول الحرفي (قبل وبعد)' : 'The Transformation Journey (Before & After)'}
        </span>
        <h2 className="mt-2 text-2xl font-bold text-[#1A1209] dark:text-[#FAF7F2] md:text-4xl font-display">
          {isAr ? 'من الجذع الخام إلى التحفة الملكية' : 'From Raw Trunk to Masterpiece'}
        </h2>
        <p className="mt-3 text-sm md:text-base text-[#6B5C4E] dark:text-[#D4B896] leading-relaxed">
          {isAr ? current.descAr : current.descEn}
        </p>

        {/* Preset Selector Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setActivePresetIndex(idx)
                setSliderPos(50)
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                activePresetIndex === idx
                  ? 'bg-[#2C1810] dark:bg-[#C4854A] text-[#FAF7F2] shadow-md ring-2 ring-[#C4854A]'
                  : 'bg-[#F0E8D8] dark:bg-[#23150D] text-[#3D2B1A] dark:text-[#E8DDD0] hover:bg-[#E4D8C4] dark:hover:bg-[#2E1C12]'
              }`}
            >
              {isAr ? preset.nameAr : preset.nameEn}
            </button>
          ))}
        </div>
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
        className="relative aspect-16/10 sm:aspect-21/9 w-full select-none overflow-hidden rounded-2xl border-2 border-[#D4B896] dark:border-[#3D2619] bg-[#2C1810] cursor-ew-resize shadow-xl group"
      >
        {/* Base Layer: Finished Masterpiece (Right / Underneath) */}
        <div className="absolute inset-0">
          <Image
            src={current.finishedImage}
            alt={isAr ? current.finishedLabelAr : current.finishedLabelEn}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
          {/* Badge Finished */}
          <div className="absolute bottom-4 end-4 rounded-full bg-[#2C1810]/90 px-4 py-1.5 text-xs font-bold text-[#FAF7F2] backdrop-blur-md border border-[#C4854A] shadow-xl flex items-center gap-1.5">
            <span>{isAr ? current.finishedLabelAr : current.finishedLabelEn}</span>
          </div>
        </div>

        {/* Top Clipped Layer: Raw Wood Slab (Left / Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
          style={{
            clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`,
          }}
        >
          <Image
            src={current.rawImage}
            alt={isAr ? current.rawLabelAr : current.rawLabelEn}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
            priority
          />
          {/* Badge Raw */}
          <div className="absolute top-4 start-4 rounded-full bg-black/85 px-4 py-1.5 text-xs font-bold text-[#D4B896] backdrop-blur-md border border-white/25 shadow-xl flex items-center gap-1.5">
            <span>{isAr ? current.rawLabelAr : current.rawLabelEn}</span>
          </div>
        </div>

        {/* Slider Handle Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-[#FAF7F2] via-[#C4854A] to-[#FAF7F2] shadow-[0_0_15px_rgba(196,133,74,0.9)] will-change-[left]"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Center Grab Handle Button */}
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#2C1810] border-2 border-[#C4854A] shadow-2xl text-[#FAF7F2] transition-transform duration-150 group-hover:scale-110 active:scale-95 cursor-ew-resize">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 3 12 9 6" className="-translate-x-1 opacity-70" />
              <polyline points="9 18 15 12 9 6" className="translate-x-3 rotate-180 opacity-70" />
            </svg>
          </div>
        </div>

        {/* Hint overlay on first load */}
        <div className="absolute bottom-4 start-1/2 -translate-x-1/2 pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity bg-black/70 backdrop-blur-sm px-3.5 py-1 rounded-full text-[11px] font-bold text-white border border-white/10">
          {isAr ? '⟷ اسحب المقبض لرؤية التحول' : '⟷ Drag handle to see transformation'}
        </div>
      </div>

      {/* Footer Info / Key Craft Standards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 text-center border-t border-[#E8DDD0] dark:border-[#2C1B10] pt-6">
        <div className="bg-[#FAF7F2] dark:bg-[#1A1009] p-3.5 rounded-2xl border border-[#E8DDD0]/60 dark:border-[#2C1B10]">
          <p className="text-xl sm:text-2xl font-bold text-[#2C1810] dark:text-[#FAF7F2] font-display">{current.stats.purity}</p>
          <p className="text-xs text-[#6B5C4E] dark:text-[#D4B896] mt-0.5 font-medium">{isAr ? 'خشب طبيعي 100%' : '100% Solid Wood'}</p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#1A1009] p-3.5 rounded-2xl border border-[#E8DDD0]/60 dark:border-[#2C1B10]">
          <p className="text-xl sm:text-2xl font-bold text-[#2C1810] dark:text-[#FAF7F2] font-display">{isAr ? current.stats.curingAr.split(' ')[0] + ' ' + current.stats.curingAr.split(' ')[1] : current.stats.curing}</p>
          <p className="text-xs text-[#6B5C4E] dark:text-[#D4B896] mt-0.5 font-medium">{isAr ? 'فترة التجفيف الهوائي' : 'Kiln-Air Curing'}</p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#1A1009] p-3.5 rounded-2xl border border-[#E8DDD0]/60 dark:border-[#2C1B10]">
          <p className="text-xl sm:text-2xl font-bold text-[#2C1810] dark:text-[#FAF7F2] font-display">{isAr ? current.stats.hoursAr.split(' ')[0] : current.stats.hours}</p>
          <p className="text-xs text-[#6B5C4E] dark:text-[#D4B896] mt-0.5 font-medium">{isAr ? 'ساعة تشكيل يدوي' : 'Handcrafting Hours'}</p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#1A1009] p-3.5 rounded-2xl border border-[#E8DDD0]/60 dark:border-[#2C1B10]">
          <p className="text-xl sm:text-2xl font-bold text-[#2C1810] dark:text-[#FAF7F2] font-display">{isAr ? '0%' : '0%'}</p>
          <p className="text-xs text-[#6B5C4E] dark:text-[#D4B896] mt-0.5 font-medium">{isAr ? 'كيماويات (زيوت عضوية)' : 'Zero Chemicals'}</p>
        </div>
      </div>
    </div>
  )
}
