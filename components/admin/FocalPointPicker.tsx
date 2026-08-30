'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { FocalPoint } from '@/lib/types'

interface Props {
  imageUrl: string
  focalPoint?: FocalPoint
  onChange: (fp: FocalPoint) => void
}

export default function FocalPointPicker({ imageUrl, focalPoint = { x: 50, y: 50 }, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<FocalPoint>(focalPoint)

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    const newPos = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
    setPos(newPos)
    onChange(newPos)
  }

  return (
    <div className="rounded-2xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#150D08] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2] flex items-center gap-1.5">
            <span>🎯</span>
            <span>نقطة التركيز البصري (Focal Point)</span>
          </p>
          <p className="text-[11px] text-[#6B5C4E] dark:text-[#D4B896]">
            انقر على أهم جزء في الصورة لضمان بقائه في المنتصف دائماً على شاشات الموبايل والكروت.
          </p>
        </div>
        <span className="rounded-lg bg-black/75 px-2.5 py-1 font-mono text-xs text-white">
          X: {pos.x}% · Y: {pos.y}%
        </span>
      </div>

      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-black/10 cursor-crosshair shadow-inner select-none"
      >
        <Image
          src={imageUrl}
          alt="Focal point picker preview"
          fill
          sizes="600px"
          className="object-cover"
        />

        {/* Target Reticle */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-[0_0_12px_rgba(196,133,74,1)] transition-all"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="h-2 w-2 rounded-full bg-[#C4854A] ring-2 ring-white" />
        </div>
      </div>
    </div>
  )
}
