'use client'

import { useState } from 'react'
import type { SiteContent } from '@/lib/types'

interface Props {
  initialContent: Record<string, SiteContent>
}

const CONTENT_FIELDS = [
  { key: 'hero_title', label: 'عنوان الصفحة الرئيسية' },
  { key: 'hero_subtitle', label: 'العنوان الفرعي للصفحة الرئيسية' },
  { key: 'about_intro', label: 'مقدمة صفحة من نحن' },
  { key: 'about_philosophy', label: 'فلسفتنا' },
  { key: 'about_materials', label: 'موادنا' },
  { key: 'contact_phone', label: 'رقم الهاتف' },
  { key: 'contact_instagram', label: 'إنستغرام (@username)' },
  { key: 'contact_email', label: 'البريد الإلكتروني' },
  { key: 'footer_tagline', label: 'شعار الفوتر' },
]

const inputClass = 'w-full rounded-xl border border-[#E8DDD0] bg-white px-3 py-2.5 text-sm text-[#1A1209] outline-none transition focus:border-[#2C1810] focus:ring-2 focus:ring-[#2C1810]/10 placeholder:text-[#A09080] resize-none'

export default function ContentEditor({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(key: string, lang: 'ar' | 'en', value: string) {
    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        key,
        [lang === 'ar' ? 'valueAr' : 'valueEn']: value,
      } as SiteContent,
    }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error(((await res.json()) as Record<string,string>).error ?? 'حدث خطأ')
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-5">
        {CONTENT_FIELDS.map((field) => {
          const c = content[field.key]
          return (
            <div key={field.key} className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
              <p className="mb-3 font-semibold text-[#1A1209]">{field.label}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6B5C4E]">عربي</label>
                  <textarea
                    rows={2}
                    value={c?.valueAr ?? ''}
                    onChange={(e) => handleChange(field.key, 'ar', e.target.value)}
                    className={inputClass}
                    placeholder="النص بالعربية"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6B5C4E]">English</label>
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={c?.valueEn ?? ''}
                    onChange={(e) => handleChange(field.key, 'en', e.target.value)}
                    className={inputClass}
                    placeholder="English text"
                  />
                </div>
              </div>
            </div>
          )
        })}

        {saved && (
          <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ تم حفظ التغييرات بنجاح
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <div className="border-t border-[#E8DDD0] pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex min-h-[44px] items-center rounded-xl bg-[#2C1810] px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'جارٍ الحفظ…' : 'حفظ جميع التغييرات'}
          </button>
        </div>
      </div>
    </div>
  )
}
