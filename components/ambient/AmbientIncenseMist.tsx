'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/components/theme/ThemeProvider'

export default function AmbientIncenseMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark } = useTheme()
  const [hasCustomVideo, setHasCustomVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check if user placed a custom video asset at /effects/smoke.mp4 or /effects/smoke.webm
  useEffect(() => {
    fetch('/effects/smoke.mp4', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setHasCustomVideo(true)
      })
      .catch(() => {})
  }, [])

  // Realistic Fluid Incense Smoke Particle Simulation
  useEffect(() => {
    if (hasCustomVideo) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    function handleResize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      maxOpacity: number
      life: number
      maxLife: number
      angle: number
      angularSpeed: number
    }

    const particles: Particle[] = []
    const particleCount = 28

    function createParticle(): Particle {
      const maxLife = 200 + Math.random() * 250
      return {
        x: Math.random() * width,
        y: height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(0.5 + Math.random() * 1.0),
        size: 50 + Math.random() * 100,
        opacity: 0,
        maxOpacity: isDark ? (0.12 + Math.random() * 0.16) : (0.08 + Math.random() * 0.12),
        life: 0,
        maxLife,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.015,
      }
    }

    // Initialize initial batch spread across bottom
    for (let i = 0; i < particleCount; i++) {
      const p = createParticle()
      p.y = height - (Math.random() * height * 0.6)
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    function render() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life++
        p.y += p.vy
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.6
        p.size += 0.25
        p.angle += p.angularSpeed

        // Fade in and fade out curve
        const progress = p.life / p.maxLife
        if (progress < 0.25) {
          p.opacity = (progress / 0.25) * p.maxOpacity
        } else if (progress > 0.65) {
          p.opacity = ((1 - progress) / 0.35) * p.maxOpacity
        } else {
          p.opacity = p.maxOpacity
        }

        // Draw soft radial smoke plume
        if (p.opacity > 0.005) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)

          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
          if (isDark) {
            // Warm Amber Gold / Frankincense Smoke in Midnight mode
            grad.addColorStop(0, `rgba(212, 184, 150, ${p.opacity * 1.5})`)
            grad.addColorStop(0.4, `rgba(196, 133, 74, ${p.opacity * 0.9})`)
            grad.addColorStop(0.8, `rgba(140, 80, 40, ${p.opacity * 0.3})`)
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
          } else {
            // Soft Warm Ivory / White Sand Haze in Daylight mode
            grad.addColorStop(0, `rgba(245, 240, 232, ${p.opacity * 1.8})`)
            grad.addColorStop(0.4, `rgba(212, 184, 150, ${p.opacity * 1.1})`)
            grad.addColorStop(0.8, `rgba(196, 133, 74, ${p.opacity * 0.4})`)
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
          }

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // Respawn when expired
        if (p.life >= p.maxLife || p.y < -p.size) {
          particles[i] = createParticle()
        }
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isDark, hasCustomVideo])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
      aria-hidden="true"
    >
      {hasCustomVideo ? (
        /* If user dropped /effects/smoke.mp4 */
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-x-0 bottom-0 h-full w-full object-cover mix-blend-screen transition-opacity duration-1000 ${
            isDark ? 'opacity-35' : 'opacity-20'
          }`}
        >
          <source src="/effects/smoke.webm" type="video/webm" />
          <source src="/effects/smoke.mp4" type="video/mp4" />
        </video>
      ) : (
        /* High-Definition 60FPS Fluid Incense Mist Canvas Overlay */
        <canvas
          ref={canvasRef}
          className={`h-full w-full mix-blend-screen transition-opacity duration-1000 ${
            isDark ? 'opacity-90' : 'opacity-70'
          }`}
        />
      )}
    </div>
  )
}
