'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/components/theme/ThemeProvider'

export default function AmbientIncenseMist() {
  const { isDark } = useTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Ensure video plays smoothly across all modern browsers
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.defaultMuted = true
      video.muted = true
      video.play().catch(() => {
        // Autoplay policy fallback: re-trigger on user interaction
        const playOnInteraction = () => {
          video.play()
          window.removeEventListener('click', playOnInteraction)
          window.removeEventListener('scroll', playOnInteraction)
          window.removeEventListener('touchstart', playOnInteraction)
        }
        window.addEventListener('click', playOnInteraction, { once: true })
        window.addEventListener('scroll', playOnInteraction, { once: true })
        window.addEventListener('touchstart', playOnInteraction, { once: true })
      })
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 4K Real UHD Atmospheric Smoke Layer (3051490-uhd_3840_2160_25fps / smoke.mp4) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-1000 ${
          videoLoaded
            ? isDark
              ? 'opacity-65 brightness-125 contrast-125'
              : 'opacity-35 brightness-110 contrast-110'
            : 'opacity-0'
        }`}
      >
        <source src="/effects/3051490-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        <source src="/effects/smoke.mp4" type="video/mp4" />
        <source src="/effects/smoke.webm" type="video/webm" />
      </video>

      {/* Subtle warm amber lighting vignette in Midnight mode */}
      {isDark && (
        <div className="absolute inset-0 bg-radial from-transparent via-[#0E0805]/10 to-[#0E0805]/40 pointer-events-none" />
      )}
    </div>
  )
}
