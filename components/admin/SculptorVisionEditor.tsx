'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { SculptorVision } from '@/lib/types'
import { Button, Spinner } from '@heroui/react'

interface Props {
  vision?: SculptorVision
  onChange: (vision: SculptorVision | undefined) => void
}

export default function SculptorVisionEditor({ vision, onChange }: Props) {
  const [enabled, setEnabled] = useState(!!vision)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const current: SculptorVision = vision ?? {
    rawImage: '',
    storyAr: '',
    storyEn: '',
    quoteAr: 'التصميم لا يُفرض على الخشب.. بل يُستخرج من روحه وانحناءاته الطبيعية.',
    quoteEn: 'True design is never imposed upon timber; it is liberated from the organic spirit of the tree.',
  }

  function handleToggle(active: boolean) {
    setEnabled(active)
    if (!active) {
      onChange(undefined)
    } else {
      onChange(current)
    }
  }

  async function handleRawImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('type', 'product')
      const res = await fetch('/api/upload', { method: 'POST', body: data })
      if (!res.ok) throw new Error('فشل رفع صورة الجذع الخام')
      const json = await res.json() as Record<string, string>
      const updated: SculptorVision = { ...current, rawImage: json.url }
      onChange(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="rounded-2xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-white dark:bg-[#150D08] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#1A1209] dark:text-[#FAF7F2] flex items-center gap-2">
            <span>🪵</span>
            <span>رؤية الحرفي: كيف وُلدت الفكرة من الجذع الخام (Sculptor Vision)</span>
          </h4>
          <p className="text-xs text-[#6B5C4E] dark:text-[#D4B896] mt-0.5">
            تفعيل ميزة المقارنة بين الجذع الخام قبل النحت والتحفة المصقولة وسرد قصة الاستخراج.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleToggle(!enabled)}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            enabled
              ? 'bg-[#C4854A] text-white shadow-xs'
              : 'bg-[#F0E8D8] dark:bg-[#2C1B10] text-[#3D2B1A] dark:text-[#E8DDD0]'
          }`}
        >
          {enabled ? '✓ مفعّل لهذه القطعة' : '+ تفعيل الميزة'}
        </button>
      </div>

      {enabled && (
        <div className="mt-5 grid gap-6 border-t border-[#E8DDD0] dark:border-[#2C1B10] pt-4 lg:grid-cols-12">
          {/* Raw Trunk Image Upload */}
          <div className="lg:col-span-4">
            <label className="mb-2 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
              صورة الجذع الخام قبل التشكيل
            </label>
            {current.rawImage ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] shadow-xs">
                <Image
                  src={current.rawImage}
                  alt="Raw trunk"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...current, rawImage: '' })}
                  className="absolute top-2 end-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#1A1009] p-4 text-center text-xs text-[#8A7968] hover:border-[#C4854A]"
              >
                {uploading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <span className="text-3xl mb-1">📸</span>
                    <span className="font-bold text-[#C4854A]">انقر لرفع صورة الجذع الخام</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleRawImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Vision Stories & Quote */}
          <div className="lg:col-span-8 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                حكاية استخراج المنحوتة من الجذع (بالعربي)
              </label>
              <textarea
                rows={2}
                value={current.storyAr}
                onChange={(e) => onChange({ ...current, storyAr: e.target.value })}
                placeholder="اشرح كيف لاحظ الحرفي انحناءة الجذع وقرر تحريرها دون قص العقدة..."
                className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A] resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                حكاية الاستخراج (بالإنجليزية)
              </label>
              <textarea
                rows={2}
                value={current.storyEn}
                onChange={(e) => onChange({ ...current, storyEn: e.target.value })}
                placeholder="Explain how the artisan perceived the hidden organic flow..."
                className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A] resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#1A1209] dark:text-[#FAF7F2]">
                اقتباس الحرفي الفلسفي (Craftsman Quote)
              </label>
              <input
                type="text"
                value={current.quoteAr ?? ''}
                onChange={(e) => onChange({ ...current, quoteAr: e.target.value })}
                className="w-full rounded-xl border border-[#E8DDD0] dark:border-[#2C1B10] bg-[#FAF7F2] dark:bg-[#1A1009] px-3.5 py-2 text-xs text-[#1A1209] dark:text-[#FAF7F2] outline-none focus:border-[#C4854A]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
