'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { SculpturalHotspot } from '@/lib/types'

interface Props {
  imageUrl: string
  hotspots?: SculpturalHotspot[]
  onChange: (hotspots: SculpturalHotspot[]) => void
}

export default function HotspotEditorModal({
  imageUrl,
  hotspots = [],
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(hotspots[0]?.id ?? null)

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)

    const newHotspot: SculpturalHotspot = {
      id: `hs_${Date.now()}`,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      titleAr: 'تفصيلة جديدة',
      titleEn: 'New Detail',
      descAr: '',
      descEn: '',
    }

    const updated = [...hotspots, newHotspot]
    onChange(updated)
    setSelectedId(newHotspot.id)
  }

  function updateHotspot(id: string, patch: Partial<SculpturalHotspot>) {
    const updated = hotspots.map((h) => (h.id === id ? { ...h, ...patch } : h))
    onChange(updated)
  }

  function deleteHotspot(id: string) {
    const updated = hotspots.filter((h) => h.id !== id)
    onChange(updated)
    if (selectedId === id) setSelectedId(updated[0]?.id ?? null)
  }

  const selected = hotspots.find((h) => h.id === selectedId)

  return (
    <div className="furnish-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] flex items-center gap-2">
            <span className="text-[#d47f31] font-bold">✦</span>
            <span>نقاط الاستكشاف النحتي التفاعلية (Sculptural Hotspots)</span>
          </h4>
          <p className="text-xs text-[#615b51] dark:text-[#a8a196] mt-0.5">
            انقر في أي مكان فوق صورة التحفة لإضافة نقطة استكشاف تشرح سر الزاوية للعميل.
          </p>
        </div>
        <span className="bg-[#d47f31]/15 px-3 py-1 text-xs font-bold text-[#d47f31]">
          {hotspots.length} نقاط مضافة
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive Click Canvas */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onClick={handleImageClick}
            className="relative aspect-16/10 w-full overflow-hidden border border-[#ecebe9] dark:border-[#2a2723] bg-black/10 cursor-crosshair select-none shadow-md"
          >
            <Image
              src={imageUrl}
              alt="Hotspot placement preview"
              fill
              sizes="600px"
              className="object-cover"
            />

            {/* Hotspot Pins */}
            {hotspots.map((h, i) => (
              <button
                key={h.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedId(h.id)
                }}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center text-xs font-bold transition-transform shadow-lg cursor-pointer ${
                  selectedId === h.id
                    ? 'bg-[#d47f31] text-white ring-4 ring-white scale-125'
                    : 'bg-[#11100e] text-white border border-[#d47f31] hover:scale-110'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Hotspot Form */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {selected ? (
            <div className="space-y-3 border border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#161513] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#d47f31]">
                  تعديل النقطة #{hotspots.findIndex((h) => h.id === selected.id) + 1} (X: {selected.x}%, Y: {selected.y}%)
                </span>
                <button
                  type="button"
                  onClick={() => deleteHotspot(selected.id)}
                  className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                >
                  حذف النقطة ✕
                </button>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
                  عنوان التفصيلة (بالعربي)
                </label>
                <input
                  type="text"
                  value={selected.titleAr}
                  onChange={(e) => updateHotspot(selected.id, { titleAr: e.target.value })}
                  className="w-full border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3 py-1.5 text-xs text-[#11100e] dark:text-[#f6f5f4] outline-none focus:border-[#d47f31]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
                  عنوان التفصيلة (بالإنجليزية)
                </label>
                <input
                  type="text"
                  value={selected.titleEn}
                  onChange={(e) => updateHotspot(selected.id, { titleEn: e.target.value })}
                  className="w-full border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3 py-1.5 text-xs text-[#11100e] dark:text-[#f6f5f4] outline-none focus:border-[#d47f31]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
                  شرح سر النحت والتفاني (بالعربي)
                </label>
                <textarea
                  rows={2}
                  value={selected.descAr}
                  onChange={(e) => updateHotspot(selected.id, { descAr: e.target.value })}
                  className="w-full border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3 py-1.5 text-xs text-[#11100e] dark:text-[#f6f5f4] outline-none focus:border-[#d47f31] resize-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
                  شرح سر النحت (بالإنجليزية)
                </label>
                <textarea
                  rows={2}
                  value={selected.descEn}
                  onChange={(e) => updateHotspot(selected.id, { descEn: e.target.value })}
                  className="w-full border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3 py-1.5 text-xs text-[#11100e] dark:text-[#f6f5f4] outline-none focus:border-[#d47f31] resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center border border-dashed border-[#ecebe9] dark:border-[#2a2723] p-6 text-center text-xs text-[#615b51] dark:text-[#a8a196]">
              <span className="text-2xl mb-1">👆</span>
              <span>انقر على أي جزء في الصورة لإضافة وتعديل نقطة نحتية.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
