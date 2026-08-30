'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { SculpturalHotspot } from '@/lib/types'
import { Button } from '@heroui/react'

interface Props {
  imageUrl: string
  hotspots: SculpturalHotspot[]
  onChange: (hotspots: SculpturalHotspot[]) => void
}

export default function HotspotEditorModal({ imageUrl, hotspots, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)

    const newId = `hs-${Date.now()}`
    const newHotspot: SculpturalHotspot = {
      id: newId,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      titleAr: 'تفصيلة نحتية جديدة',
      titleEn: 'New Sculptural Detail',
      descAr: 'اكتب هنا قصة الحرفة وسر نحت هذه الزاوية واللمسة اليدوية.',
      descEn: 'Describe the artisan carving triumph and hand-shaping technique here.',
    }

    const updated = [...hotspots, newHotspot]
    onChange(updated)
    setSelectedId(newId)
  }

  function updateHotspot(id: string, updates: Partial<SculpturalHotspot>) {
    const updated = hotspots.map((h) => (h.id === id ? { ...h, ...updates } : h))
    onChange(updated)
  }

  function deleteHotspot(id: string) {
    const updated = hotspots.filter((h) => h.id !== id)
    onChange(updated)
    if (selectedId === id) setSelectedId(null)
  }

  const selected = hotspots.find((h) => h.id === selectedId)

  return (
    <div className="rounded-2xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-[#1A1209] dark:text-[#FAF7F2] flex items-center gap-2">
            <span className="text-[#C4854A] font-bold">✦</span>
            <span>نقاط الاستكشاف النحتي التفاعلية (Sculptural Hotspots)</span>
          </h4>
          <p className="text-xs text-[#6B5C4E] dark:text-[#D4B896] mt-0.5">
            انقر في أي مكان فوق صورة التحفة لإضافة نقطة استكشاف ذهبية تشرح سر الزاوية للعميل.
          </p>
        </div>
        <span className="rounded-full bg-[#C4854A]/15 px-3 py-1 text-xs font-bold text-[#6B3F1F] dark:text-[#D4B896]">
          {hotspots.length} نقاط مضافة
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive Click Canvas */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onClick={handleImageClick}
            className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-black/10 cursor-crosshair select-none shadow-md"
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
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-transform shadow-lg cursor-pointer ${
                  selectedId === h.id
                    ? 'bg-[#C4854A] text-white ring-4 ring-white scale-125'
                    : 'bg-[#2C1810] text-[#FAF7F2] border border-[#C4854A] hover:scale-110'
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
            <div className="space-y-3 rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#1A1009] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C4854A]">
                  تعديل النقطة #{hotspots.findIndex((h) => h.id === selected.id) + 1} (X: {selected.x}%, Y: {selected.y}%)
                </span>
                <button
                  type="button"
                  onClick={() => deleteHotspot(selected.id)}
                  className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                >
                  حذف النقطة ✕
                </button>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                  عنوان التفصيلة (بالعربي)
                </label>
                <input
                  type="text"
                  value={selected.titleAr}
                  onChange={(e) => updateHotspot(selected.id, { titleAr: e.target.value })}
                  className="w-full rounded-lg border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] px-3 py-1.5 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                  عنوان التفصيلة (بالإنجليزية)
                </label>
                <input
                  type="text"
                  value={selected.titleEn}
                  onChange={(e) => updateHotspot(selected.id, { titleEn: e.target.value })}
                  className="w-full rounded-lg border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] px-3 py-1.5 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                  شرح سر النحت والتفاني (بالعربي)
                </label>
                <textarea
                  rows={2}
                  value={selected.descAr}
                  onChange={(e) => updateHotspot(selected.id, { descAr: e.target.value })}
                  className="w-full rounded-lg border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] px-3 py-1.5 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A] resize-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                  شرح سر النحت (بالإنجليزية)
                </label>
                <textarea
                  rows={2}
                  value={selected.descEn}
                  onChange={(e) => updateHotspot(selected.id, { descEn: e.target.value })}
                  className="w-full rounded-lg border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] px-3 py-1.5 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A] resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#E8DDD0] dark:border-[#2C1B10] p-6 text-center text-xs text-[#8A7968]">
              <span className="text-2xl mb-1">👆</span>
              <span>انقر على أي جزء في الصورة لإضافة وتعديل نقطة نحتية.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
