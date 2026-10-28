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
    <div className="furnish-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] flex items-center gap-1.5">
            <span>🎯</span>
            <span>نقطة التركيز البصري (Focal Point)</span>
          </p>
          <p className="text-[11px] text-[#615b51] dark:text-[#a8a196]">
            انقر على أهم جزء في الصورة لضمان بقائه في المنتصف دائماً على شاشات الموبايل والكروت.
          </p>
        </div>
        <span className="bg-black text-white px-2.5 py-1 font-mono text-xs">
          X: {pos.x}% · Y: {pos.y}%
        </span>
      </div>

      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative aspect-16/10 w-full overflow-hidden border border-[#ecebe9] dark:border-[#2a2723] cursor-crosshair shadow-inner select-none"
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
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-[0_0_12px_rgba(212,127,49,1)] transition-all"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="h-2 w-2 rounded-full bg-[#d47f31] ring-2 ring-white" />
        </div>
      </div>
    </div>
  )
}
