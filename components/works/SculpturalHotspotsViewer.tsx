'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SculpturalHotspot, Locale } from '@/lib/types'
import { useAtelierAudio } from '@/components/interactive/AtelierHapticAudio'

interface Props {
  imageUrl: string
  title: string
  hotspots: SculpturalHotspot[]
  locale: Locale
}

export default function SculpturalHotspotsViewer({ imageUrl, title, hotspots, locale }: Props) {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null)
  const isAr = locale === 'ar'
  const { playSound } = useAtelierAudio()

  if (!hotspots || hotspots.length === 0) return null

  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId)

  return (
    <section className="section-padding bg-[#FAF7F2] dark:bg-[#0E0805] border-t border-[#E8DDD0] dark:border-[#2C1B10] transition-colors duration-400">
      <div className="container-site">
        {/* Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <span className={`text-xs font-bold text-[#C4854A] ${isAr ? 'font-display' : 'uppercase tracking-[0.2em]'}`}>
            {isAr ? 'قراءة التحفة كعمل فني نحتي' : 'Sculptural Masterpiece Anatomy'}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-[#1A1209] dark:text-[#FAF7F2] md:text-3xl font-display">
            {isAr ? 'نقاط الاستكشاف النحتي واللمسات الفريدة' : 'Interactive Sculptural Design Hotspots'}
          </h2>
          <p className="mt-2 text-sm text-[#6B5C4E] dark:text-[#D4B896] leading-relaxed">
            {isAr
              ? 'انقر على النقاط الذهبية النابضة فوق التحفة لاستكشاف سر نحت كل زاوية وانسياب العروق الطبيعية.'
              : 'Click on the golden pulsing nodes over the piece to reveal the craftsman triumphs and liberated grain.'}
          </p>
        </div>

        {/* Interactive Masterpiece Canvas */}
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          {/* Main Visual Image with Hotspots */}
          <div className="lg:col-span-8">
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl border-2 border-[#D4B896] dark:border-[#2C1B10] shadow-2xl bg-[#1A1009] select-none">
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className={`object-cover transition-transform duration-700 ${
                  activeHotspot ? 'scale-110' : 'scale-100'
                }`}
                style={
                  activeHotspot
                    ? { transformOrigin: `${activeHotspot.x}% ${activeHotspot.y}%` }
                    : undefined
                }
              />

              {/* Dynamic Hotspot Pins */}
              {hotspots.map((h, idx) => {
                const isActive = h.id === activeHotspotId
                return (
                  <div
                    key={h.id}
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    {/* Pulsing ring animation */}
                    <span className="absolute -inset-2.5 rounded-full bg-[#C4854A]/40 animate-ping" />

                    <button
                      type="button"
                      onClick={() => {
                        playSound('ping')
                        setActiveHotspotId(isActive ? null : h.id)
                      }}
                      className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 shadow-2xl cursor-pointer ${
                        isActive
                          ? 'bg-[#C4854A] text-white ring-4 ring-white scale-125 shadow-[0_0_20px_rgba(196,133,74,0.9)]'
                          : 'bg-[#2C1810]/90 text-[#FAF7F2] backdrop-blur-md border border-[#D4B896] hover:scale-115'
                      }`}
                      aria-label={isAr ? h.titleAr : h.titleEn}
                    >
                      <span>✦</span>
                    </button>
                  </div>
                )
              })}

              {/* Overlay Hint */}
              {!activeHotspot && (
                <div className="absolute bottom-4 start-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-white border border-white/20 pointer-events-none">
                  {isAr ? '👆 انقر على النجوم الذهبية لكشف أسرار النحت' : '👆 Click golden stars to explore details'}
                </div>
              )}
            </div>
          </div>

          {/* Hotspot Narrative Story Card */}
          <div className="lg:col-span-4">
            {activeHotspot ? (
              <div className="rounded-3xl border border-[#C4854A]/40 bg-white dark:bg-[#150D08] p-6 sm:p-7 shadow-xl transition-all animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DDD0] dark:border-[#2C1B10]">
                  <span className="rounded-full bg-[#C4854A]/15 px-3 py-1 text-xs font-bold text-[#C4854A]">
                    {isAr ? 'بصمة نحتية فريدة' : 'Sculptural Highlight'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveHotspotId(null)}
                    className="text-xs font-bold text-[#8A7968] hover:text-[#1A1209] dark:hover:text-white"
                  >
                    إغلاق ✕
                  </button>
                </div>

                <h3 className="mt-4 text-lg sm:text-xl font-bold text-[#1A1209] dark:text-[#FAF7F2] font-display">
                  {isAr ? activeHotspot.titleAr : activeHotspot.titleEn}
                </h3>

                <p className="mt-3 text-sm text-[#4A3B2C] dark:text-[#D4B896] leading-relaxed font-medium">
                  {isAr ? activeHotspot.descAr : activeHotspot.descEn}
                </p>

                <div className="mt-6 pt-4 border-t border-[#E8DDD0] dark:border-[#2C1B10] flex items-center gap-2 text-xs text-[#8A7968]">
                  <span>💎</span>
                  <span>{isAr ? 'تفصيلة يدوية لا يمكن تكرارها في أي قطعة أخرى' : 'Unrepeatable artisan signature'}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#E8DDD0] dark:border-[#2C1B10] p-8 text-center bg-white/50 dark:bg-[#150D08]/50">
                <span className="text-4xl mb-3 block">🪵✨</span>
                <h4 className="text-base font-bold text-[#1A1209] dark:text-[#FAF7F2] font-display">
                  {isAr ? 'استكشف عبقرية التشكيل' : 'Discover Sculptural Secrets'}
                </h4>
                <p className="mt-2 text-xs text-[#6B5C4E] dark:text-[#D4B896] leading-relaxed">
                  {isAr
                    ? 'كل انحناءة وعقدة في هذه الطاولة لها قصة ملهمة استخرجها الحرفي فهد غصن يدوياً.'
                    : 'Every contour and grain knot has a dedicated story liberated by hand.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
