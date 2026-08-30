'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/types'

interface Props {
  imageUrl: string
  title: string
  locale: Locale
}

export default function SculpturalShadowTheater({ imageUrl, title, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [lightAngle, setLightAngle] = useState(45) // 0 to 360 degrees
  const [isAutoOrbit, setIsAutoOrbit] = useState(true)
  const isAr = locale === 'ar'

  useEffect(() => {
    if (!isOpen || !isAutoOrbit) return
    const interval = setInterval(() => {
      setLightAngle((prev) => (prev + 1) % 360)
    }, 40)
    return () => clearInterval(interval)
  }, [isOpen, isAutoOrbit])

  const rad = (lightAngle * Math.PI) / 180
  const lightX = 50 + Math.cos(rad) * 40
  const lightY = 50 + Math.sin(rad) * 40

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border border-[#C4854A] bg-[#2C1810] px-5 text-xs font-bold text-[#FAF7F2] shadow-lg transition-all hover:bg-[#3D2216] hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span>🎭</span>
        <span>{isAr ? 'مسرح الضوء والظل النحتي (Chiaroscuro Theater)' : 'Sculptural Shadow Theater'}</span>
      </button>

      {/* Fullscreen Theater Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-fadeIn select-none">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 end-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all cursor-pointer text-lg"
          >
            ✕
          </button>

          {/* Theater Canvas Container */}
          <div className="relative flex flex-col items-center max-w-5xl w-full">
            {/* Header info */}
            <div className="text-center mb-6">
              <span className="rounded-full bg-[#C4854A]/20 px-4 py-1 text-xs font-bold text-[#D4B896] border border-[#C4854A]/40">
                {isAr ? 'إضاءة متحفية ديناميكية' : 'Museum Chiaroscuro Lighting'}
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white font-display">
                {title}
              </h3>
              <p className="mt-1 text-xs text-white/60">
                {isAr
                  ? 'شاهد تباين الضوء والظلال حول انحناءات الخشب المصقول بزاوية 360°'
                  : 'Observe 360-degree light and shadow contrasts accentuating sculptural live contours.'}
              </p>
            </div>

            {/* Stage Showcase */}
            <div className="relative aspect-16/10 w-full max-h-[60vh] overflow-hidden rounded-3xl border border-white/10 bg-[#080503] shadow-[0_0_80px_rgba(0,0,0,0.9)] flex items-center justify-center">
              {/* Dynamic Directional Spotlight Shader */}
              <div
                className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 500px at ${lightX}% ${lightY}%, rgba(255,235,200,0.28) 0%, rgba(0,0,0,0.85) 100%)`,
                  mixBlendMode: 'screen',
                }}
              />

              {/* High-res Image */}
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="1200px"
                className="object-contain p-4 drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Interactive Stage Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => setIsAutoOrbit(!isAutoOrbit)}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isAutoOrbit
                    ? 'bg-[#C4854A] text-white shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {isAutoOrbit ? (isAr ? '⏸ إيقاف الدوران التلقائي' : '⏸ Pause Auto Orbit') : (isAr ? '▶ تفعيل الدوران التلقائي' : '▶ Play Auto Orbit')}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70">💡 {isAr ? 'زاوية الضوء:' : 'Light Angle:'}</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={lightAngle}
                  onChange={(e) => {
                    setIsAutoOrbit(false)
                    setLightAngle(Number(e.target.value))
                  }}
                  className="w-36 accent-[#C4854A] cursor-pointer"
                />
                <span className="font-mono text-xs text-[#D4B896]">{lightAngle}°</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
