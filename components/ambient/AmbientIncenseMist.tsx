'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/components/theme/ThemeProvider'

export default function AmbientIncenseMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let isVisible = true

    function handleResize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    function handleVisibility() {
      isVisible = !document.hidden
    }

    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('visibilitychange', handleVisibility)

    // Featherlight Organic Incense Mist Particle Plumes
    interface MistParticle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      growth: number
      opacity: number
      maxOpacity: number
      life: number
      maxLife: number
      driftOffset: number
      driftSpeed: number
      angle: number
      angularSpeed: number
    }

    const particles: MistParticle[] = []
    const count = 18 // Minimal count for ultra-smooth 120/60 FPS & 0% CPU overhead

    function createParticle(initialY?: number): MistParticle {
      const maxLife = 260 + Math.random() * 320
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + 30 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.35 + Math.random() * 0.55),
        size: 90 + Math.random() * 160,
        growth: 0.25 + Math.random() * 0.35,
        opacity: 0,
        maxOpacity: isDark ? (0.07 + Math.random() * 0.08) : (0.04 + Math.random() * 0.05),
        life: 0,
        maxLife,
        driftOffset: Math.random() * 100,
        driftSpeed: 0.008 + Math.random() * 0.012,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.006,
      }
    }

    // Seed initial positions
    for (let i = 0; i < count; i++) {
      const p = createParticle(Math.random() * height)
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    function render() {
      if (!ctx || !canvas) return

      if (isVisible) {
        ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          p.life++
          p.y += p.vy
          p.x += p.vx + Math.sin(p.life * p.driftSpeed + p.driftOffset) * 0.5
          p.size += p.growth
          p.angle += p.angularSpeed

          // Smooth bell-curve fade
          const progress = p.life / p.maxLife
          if (progress < 0.3) {
            p.opacity = (progress / 0.3) * p.maxOpacity
          } else if (progress > 0.7) {
            p.opacity = ((1 - progress) / 0.3) * p.maxOpacity
          } else {
            p.opacity = p.maxOpacity
          }

          if (p.opacity > 0.003) {
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.angle)

            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
            if (isDark) {
              // Warm Incense & Gilded Amber Aura in Midnight mode
              grad.addColorStop(0, `rgba(212, 184, 150, ${p.opacity * 1.6})`)
              grad.addColorStop(0.35, `rgba(196, 133, 74, ${p.opacity * 0.9})`)
              grad.addColorStop(0.7, `rgba(107, 63, 31, ${p.opacity * 0.3})`)
              grad.addColorStop(1, 'rgba(14, 8, 5, 0)')
            } else {
              // Soft Frankincense & Sand Pearl in Daylight mode
              grad.addColorStop(0, `rgba(240, 232, 216, ${p.opacity * 1.5})`)
              grad.addColorStop(0.4, `rgba(212, 184, 150, ${p.opacity * 0.8})`)
              grad.addColorStop(0.75, `rgba(196, 133, 74, ${p.opacity * 0.25})`)
              grad.addColorStop(1, 'rgba(250, 247, 242, 0)')
            }

            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }

          // Reset particle when it floats past screen top or expires
          if (p.life >= p.maxLife || p.y < -p.size * 1.5) {
            particles[i] = createParticle()
          }
        }
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [isDark])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Luxury Ambient Incense Mist Canvas */}
      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-1000 ${
          isDark ? 'opacity-85 mix-blend-screen' : 'opacity-65 mix-blend-multiply'
        }`}
      />
    </div>
  )
}
