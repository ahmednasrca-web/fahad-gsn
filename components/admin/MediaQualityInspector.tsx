'use client'

import { useState, useEffect } from 'react'

interface Props {
  imageUrl: string
  file?: File
  className?: string
}

interface ImageStats {
  width: number
  height: number
  aspectRatio: string
  fileSizeMb?: string
  tier: '4k' | 'fhd' | 'hd' | 'low'
}

export default function MediaQualityInspector({ imageUrl, file, className = '' }: Props) {
  const [stats, setStats] = useState<ImageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!imageUrl) return
    setLoading(true)
    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      const w = img.naturalWidth
      const h = img.naturalHeight

      // Calculate simplified aspect ratio
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
      const divisor = gcd(w, h)
      let aspect = `${w / divisor}:${h / divisor}`
      const ratio = w / h
      if (Math.abs(ratio - 16 / 9) < 0.05) aspect = '16:9 (عريض)'
      else if (Math.abs(ratio - 4 / 3) < 0.05) aspect = '4:3 (كلاسيكي)'
      else if (Math.abs(ratio - 1) < 0.05) aspect = '1:1 (مربع)'
      else if (Math.abs(ratio - 9 / 16) < 0.05) aspect = '9:16 (ستوري / ريلز)'
      else if (Math.abs(ratio - 3 / 4) < 0.05) aspect = '3:4 (طولي)'

      let tier: ImageStats['tier'] = 'low'
      if (w >= 2560 || h >= 2560) tier = '4k'
      else if (w >= 1920 || h >= 1920) tier = 'fhd'
      else if (w >= 1200 || h >= 1200) tier = 'hd'
      else tier = 'low'

      setStats({
        width: w,
        height: h,
        aspectRatio: aspect,
        fileSizeMb: file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : undefined,
        tier,
      })
      setLoading(false)
    }
    img.onerror = () => setLoading(false)
  }, [imageUrl, file])

  if (loading || !stats) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#8A7968] animate-pulse py-1">
        <span>🔍</span>
        <span>جارٍ فحص دقة وجودة الصورة…</span>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border p-2.5 text-xs transition-all ${
        stats.tier === '4k'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
          : stats.tier === 'fhd'
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300'
          : stats.tier === 'hd'
          ? 'border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300'
          : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Tier Badge */}
        <div className="flex items-center gap-1.5 font-bold">
          {stats.tier === '4k' && <span>💎 4K Ultra-HD (دقة فائقة ممتازة للعدسة المجهرية)</span>}
          {stats.tier === 'fhd' && <span>✨ Full HD (دقة ممتازة للعرض العام)</span>}
          {stats.tier === 'hd' && <span>👌 HD Standard (دقة مقبولة)</span>}
          {stats.tier === 'low' && <span>⚠️ دقة منخفضة (قد تظهر غير واضحة عند التكبير)</span>}
        </div>

        {/* Technical Specs */}
        <div className="flex items-center gap-2 font-mono text-[11px] opacity-90">
          <span>{stats.width} × {stats.height} px</span>
          <span>•</span>
          <span>{stats.aspectRatio}</span>
          {stats.fileSizeMb && (
            <>
              <span>•</span>
              <span>{stats.fileSizeMb}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
