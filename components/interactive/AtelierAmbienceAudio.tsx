'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Locale } from '@/lib/types'

interface Props {
  locale?: Locale
}

export default function AtelierAmbienceAudio({ locale = 'ar' }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.2)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isAr = locale === 'ar'

  // Pentatonic warm wooden frequencies (Acoustic Marimba & Kalimba resonant notes)
  const WOOD_NOTES = [220, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25]

  const playOrganicWoodChime = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    try {
      const now = ctx.currentTime
      const freq = WOOD_NOTES[Math.floor(Math.random() * WOOD_NOTES.length)]

      // Oscillator: Warm triangle & sine hybrid for organic acoustic feel
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)
      // Slight subtle natural wood pitch slide
      osc.frequency.exponentialRampToValueAtTime(freq * 0.99, now + 1.2)

      // Envelope: gentle tactile attack, long warm acoustic decay
      oscGain.gain.setValueAtTime(0.001, now)
      oscGain.gain.exponentialRampToValueAtTime(0.25, now + 0.08)
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4)

      // Filter: warm low-pass to eliminate harsh high frequencies
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, now)

      osc.connect(filter)
      filter.connect(oscGain)
      oscGain.connect(masterGain)

      osc.start(now)
      osc.stop(now + 2.5)
    } catch {
      // Ignore audio synthesis errors gracefully
    }
  }, [])

  const startAmbience = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime)
      masterGain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 1.0)
      masterGain.connect(ctx.destination)

      audioCtxRef.current = ctx
      gainNodeRef.current = masterGain
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }

    const ctx = audioCtxRef.current
    const master = gainNodeRef.current
    if (!ctx || !master) return

    // Trigger initial chime
    playOrganicWoodChime(ctx, master)

    // Schedule periodic peaceful acoustic wood tones every 3-5 seconds
    intervalRef.current = setInterval(() => {
      if (ctx.state === 'running') {
        playOrganicWoodChime(ctx, master)
      }
    }, 3800)

    setIsPlaying(true)
  }, [volume, playOrganicWoodChime])

  const stopAmbience = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime
      gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.5)
    }
    setIsPlaying(false)
  }, [])

  function toggleAudio() {
    if (isPlaying) {
      stopAmbience()
    } else {
      startAmbience()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {})
    }
  }, [])

  return (
    <div
      className="fixed bottom-5 start-5 z-40 flex items-center gap-2"
      dir="ltr"
    >
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlaying ? 'كتم صوت الورشة' : 'تشغيل الأجواء الحسية للورشة'}
        className={`group flex items-center gap-2.5 rounded-full px-4 py-2.5 shadow-xl backdrop-blur-xl border transition-all duration-300 ${
          isPlaying
            ? 'bg-[#2C1810] text-[#FAF7F2] border-[#C4854A] shadow-[0_0_15px_rgba(196,133,74,0.3)] ring-2 ring-[#C4854A]/30'
            : 'bg-white text-[#1A1209] font-bold border-[#C8B8A0] hover:bg-[#FAF7F2] hover:text-[#2C1810]'
        }`}
      >
        {/* Animated Soundwave Bars */}
        <div className="flex items-center gap-0.5 h-4">
          <span
            className={`w-0.5 rounded-full transition-all duration-300 ${
              isPlaying ? 'bg-[#C4854A] animate-pulse h-3' : 'bg-[#C4854A] h-1.5'
            }`}
          />
          <span
            className={`w-0.5 rounded-full transition-all duration-300 ${
              isPlaying ? 'bg-[#C4854A] animate-bounce h-4' : 'bg-[#C4854A] h-2.5'
            }`}
          />
          <span
            className={`w-0.5 rounded-full transition-all duration-300 ${
              isPlaying ? 'bg-[#C4854A] animate-pulse h-2' : 'bg-[#C4854A] h-1'
            }`}
          />
        </div>

        {/* Text Label */}
        <span className="text-xs font-bold font-sans">
          {isPlaying
            ? (isAr ? 'أجواء الورشة: نشطة 🪵' : 'Atelier Ambience: ON')
            : (isAr ? 'أجواء الورشة 🎧' : 'Atelier Ambience')}
        </span>
      </button>
    </div>
  )
}
