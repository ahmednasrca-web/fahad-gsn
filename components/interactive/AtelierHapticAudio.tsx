'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type SoundType = 'tap' | 'loupe' | 'tick' | 'ping'

interface AudioContextType {
  isMuted: boolean
  toggleMute: () => void
  playSound: (type: SoundType) => void
}

const AudioCtx = createContext<AudioContextType>({
  isMuted: true,
  toggleMute: () => {},
  playSound: () => {},
})

export function useAtelierAudio() {
  return useContext(AudioCtx)
}

export default function AtelierHapticAudioProvider({ children }: { children?: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('fahad_gsn_audio_mute')
    if (saved !== null) {
      setIsMuted(saved === 'true')
    }
  }, [])

  function toggleMute() {
    setIsMuted((prev) => {
      const next = !prev
      localStorage.setItem('fahad_gsn_audio_mute', String(next))
      if (!next) {
        // Play gentle confirmation tone on unmute
        playTone(440, 0.08, 'sine')
      }
      return next
    })
  }

  function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.05) {
    if (isMuted) return
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gain.gain.setValueAtTime(gainVal, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  function playSound(type: SoundType) {
    if (isMuted) return
    switch (type) {
      case 'tap':
        // Warm organic low wood resonance
        playTone(180, 0.09, 'triangle', 0.08)
        break
      case 'loupe':
        // Soft velvet whisper
        playTone(520, 0.04, 'sine', 0.03)
        break
      case 'tick':
        // Swiss mechanical high micro-tick
        playTone(1200, 0.02, 'sine', 0.04)
        break
      case 'ping':
        // Gilded bell chime
        playTone(880, 0.25, 'sine', 0.06)
        break
    }
  }

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </AudioCtx.Provider>
  )
}
