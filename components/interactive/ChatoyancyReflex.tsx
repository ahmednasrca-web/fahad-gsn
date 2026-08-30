'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Locale } from '@/lib/types'

interface Props {
  imageUrl: string
  title: string
  locale: Locale
}

export default function ChatoyancyReflex({ imageUrl, title, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 50, y: 50 })
  const [isActive, setIsActive] = useState(false)
  const isAr = locale === 'ar'

  // Device orientation on mobile
  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.gamma !== null && e.beta !== null) {
        // gamma is left-to-right tilt in [-90, 90]
        // beta is front-to-back tilt in [-180, 180]
        const x = Math.max(10, Math.min(90, 50 + (e.gamma / 45) * 40))
        const y = Math.max(10, Math.min(90, 50 + ((e.beta - 45) / 45) * 40))
        setCoords({ x, y })
      }
    }

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation)
      }
    }
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setCoords({ x, y })
  }

  return (
    <div className="rounded-3xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#1A1209] dark:text-[#FAF7F2] flex items-center gap-2">
            <span>✨</span>
            <span>{isAr ? 'محاكي بريق العروق ثلاثي الأبعاد (Chatoyancy Reflex)' : '360° Grain Chatoyancy Reflex'}</span>
          </h4>
          <p className="text-xs text-[#6B5C4E] dark:text-[#D4B896] mt-0.5">
            {isAr
              ? 'حرّك الماوس أو أمِل هاتفك لمشاهدة تلألؤ الألياف الخشبية مع الضوء كالأحجار الكريمة.'
              : 'Move your mouse or tilt your phone to experience 3D wood luster under natural light.'}
          </p>
        </div>
        <span className="rounded-full bg-[#C4854A]/15 px-3 py-1 text-[11px] font-bold text-[#C4854A]">
          {isAr ? 'مستشعر الحركة مفعّل' : 'Motion Reactive'}
        </span>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-black select-none cursor-pointer border border-[#E8DDD0] dark:border-[#2C1B10]"
      >
        {/* Base Image */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-cover transition-transform duration-300"
        />

        {/* Dynamic Holographic Chatoyancy Light Glaze */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse 400px 300px at ${coords.x}% ${coords.y}%, rgba(212, 184, 150, 0.45) 0%, rgba(196, 133, 74, 0.15) 45%, transparent 70%)`,
            mixBlendMode: 'color-dodge',
            opacity: isActive ? 0.95 : 0.65,
          }}
        />

        {/* Micro coordinate HUD */}
        <div className="absolute bottom-3 end-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-white/80 border border-white/10 pointer-events-none">
          Light Vector: {Math.round(coords.x)}%, {Math.round(coords.y)}%
        </div>
      </div>
    </div>
  )
}
