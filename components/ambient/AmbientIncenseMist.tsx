'use client'

import { useTheme } from '@/components/theme/ThemeProvider'

export default function AmbientIncenseMist() {
  const { isDark } = useTheme()

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[360px] overflow-hidden select-none opacity-80"
      aria-hidden="true"
    >
      {/* ── Wave 1: Primary Slow Plume ── */}
      <div
        className={`absolute inset-x-0 -bottom-24 h-[420px] rounded-t-[100%] blur-3xl transition-colors duration-1000 will-change-transform ${
          isDark
            ? 'bg-gradient-to-t from-[#C4854A]/10 via-[#8B4513]/6 to-transparent'
            : 'bg-gradient-to-t from-[#D4B896]/15 via-[#E8DDD0]/10 to-transparent'
        }`}
        style={{
          animation: 'incenseRise 26s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }}
      />

      {/* ── Wave 2: Secondary Offset Drift Plume ── */}
      <div
        className={`absolute -inset-x-20 -bottom-16 h-[380px] rounded-t-[100%] blur-2xl transition-colors duration-1000 will-change-transform ${
          isDark
            ? 'bg-gradient-to-t from-[#D4B896]/8 via-[#C4854A]/4 to-transparent'
            : 'bg-gradient-to-t from-[#F0E8D8]/20 via-[#E8DDD0]/8 to-transparent'
        }`}
        style={{
          animation: 'incenseRise 34s cubic-bezier(0.4, 0, 0.2, 1) infinite 6s, incenseDrift 20s ease-in-out infinite alternate',
        }}
      />

      {/* ── Wave 3: Subtle Micro Mist Ribbons ── */}
      <div
        className={`absolute inset-x-12 -bottom-10 h-[300px] rounded-t-[100%] blur-xl transition-colors duration-1000 will-change-transform ${
          isDark
            ? 'bg-gradient-to-t from-[#C4854A]/6 via-transparent to-transparent'
            : 'bg-gradient-to-t from-[#FAF7F2]/25 via-transparent to-transparent'
        }`}
        style={{
          animation: 'incenseRise 42s cubic-bezier(0.4, 0, 0.2, 1) infinite 14s, incenseDrift 28s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  )
}
