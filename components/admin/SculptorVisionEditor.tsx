'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { SculptorVision } from '@/lib/types'
import { Spinner } from '@heroui/react'

interface Props {
  vision?: SculptorVision
  onChange: (vision?: SculptorVision) => void
}

export default function SculptorVisionEditor({ vision, onChange }: Props) {
  const [enabled, setEnabled] = useState(!!vision?.rawImage || !!vision?.storyAr)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const current: SculptorVision = vision ?? {
    rawImage: '',
    storyAr: '',
    storyEn: '',
    quoteAr: '',
    quoteEn: '',
  }

  function handleToggle(enable: boolean) {
    setEnabled(enable)
    if (!enable) {
      onChange(undefined)
    } else {
      onChange(current)
    }
  }

  async function handleRawImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('files', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = (await res.json()) as { urls: string[] }
      if (data.urls[0]) {
        onChange({ ...current, rawImage: data.urls[0] })
      }
    } catch (err) {
      console.error(err)
      alert('فشل رفع الصورة الخام')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="furnish-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] flex items-center gap-2">
            <span>🪵</span>
            <span>رؤية الحرفي: كيف وُلدت الفكرة من الجذع الخام (Sculptor Vision)</span>
          </h4>
          <p className="text-xs text-[#615b51] dark:text-[#a8a196] mt-0.5">
            تفعيل ميزة المقارنة بين الجذع الخام قبل النحت والتحفة المصقولة وسرد قصة الاستخراج.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleToggle(!enabled)}
          className={`border px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            enabled
              ? 'bg-[#d47f31] text-white border-[#d47f31]'
              : 'border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] text-[#11100e] dark:text-[#f6f5f4]'
          }`}
        >
          {enabled ? '✓ مفعّل لهذه القطعة' : '+ تفعيل الميزة'}
        </button>
      </div>

      {enabled && (
        <div className="mt-5 grid gap-6 border-t border-[#ecebe9] dark:border-[#2a2723] pt-4 lg:grid-cols-12">
          {/* Raw Trunk Image Upload */}
          <div className="lg:col-span-4">
            <label className="mb-2 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
              صورة الجذع الخام قبل التشكيل
            </label>
            {current.rawImage ? (
              <div className="relative aspect-square w-full overflow-hidden border border-[#ecebe9] dark:border-[#2a2723]">
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
                  className="absolute top-2 end-2 bg-black/70 p-1.5 text-white hover:bg-black"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#161513] p-4 text-center text-xs text-[#615b51] dark:text-[#a8a196] hover:border-[#d47f31]"
              >
                {uploading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <span className="text-3xl mb-1">📸</span>
                    <span className="font-bold text-[#d47f31]">انقر لرفع صورة الجذع الخام</span>
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
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
                حكاية استخراج المنحوتة من الجذع (بالعربي)
              </label>
              <textarea
                rows={2}
                value={current.storyAr}
                onChange={(e) => onChange({ ...current, storyAr: e.target.value })}
                placeholder="اشرح كيف لاحظ الحرفي انحناءة الجذع وقرر تحريرها دون قص العقدة..."
                className="w-full border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3.5 py-2 text-xs text-[#11100e] dark:text-[#f6f5f4] outline-none focus:border-[#d47f31] resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
                حكاية الاستخراج (بالإنجليزية)
              </label>
              <textarea
                rows={2}
                value={current.storyEn}
                onChange={(e) => onChange({ ...current, storyEn: e.target.value })}
                placeholder="Explain how the artisan perceived the hidden organic flow..."
                className="w-full border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3.5 py-2 text-xs text-[#11100e] dark:text-[#f6f5f4] outline-none focus:border-[#d47f31] resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">
                اقتباس الحرفي الفلسفي (Craftsman Quote)
              </label>
              <input
                type="text"
                value={current.quoteAr ?? ''}
                onChange={(e) => onChange({ ...current, quoteAr: e.target.value })}
                className="w-full border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3.5 py-2 text-xs text-[#11100e] dark:text-[#f6f5f4] outline-none focus:border-[#d47f31]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
