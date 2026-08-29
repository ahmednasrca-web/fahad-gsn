'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Reel } from '@/lib/types'
import { detectAndValidateReelUrl, PROVIDER_META, type ReelValidationResult } from '@/lib/reels/providers'

interface Props {
  reel?: Reel
}

const inputClass =
  'w-full rounded-xl border border-[#E8DDD0] bg-white px-4 py-3 text-[15px] text-[#1A1209] outline-none transition focus:border-[#2C1810] focus:ring-2 focus:ring-[#2C1810]/10 placeholder:text-[#A09080]'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#1A1209]'

export default function ReelForm({ reel }: Props) {
  const router = useRouter()
  const isEditing = !!reel

  const [url, setUrl] = useState(reel?.originalUrl ?? '')
  const [titleAr, setTitleAr] = useState(reel?.titleAr ?? '')
  const [titleEn, setTitleEn] = useState(reel?.titleEn ?? '')
  const [descAr, setDescAr] = useState(reel?.descriptionAr ?? '')
  const [descEn, setDescEn] = useState(reel?.descriptionEn ?? '')
  const [sortOrder, setSortOrder] = useState(reel?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(reel?.isPublished ?? true)
  const [isFeatured, setIsFeatured] = useState(reel?.isFeatured ?? false)

  const [detected, setDetected] = useState<ReelValidationResult | null>(() => {
    if (reel?.originalUrl) {
      try {
        return detectAndValidateReelUrl(reel.originalUrl)
      } catch {
        return null
      }
    }
    return null
  })

  const [urlError, setUrlError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleUrlChange(newUrl: string) {
    setUrl(newUrl)
    setError(null)
    if (!newUrl.trim()) {
      setDetected(null)
      setUrlError(null)
      return
    }
    try {
      const res = detectAndValidateReelUrl(newUrl)
      setDetected(res)
      setUrlError(null)
    } catch (err) {
      setDetected(null)
      setUrlError(err instanceof Error ? err.message : 'رابط غير صالح')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return

    if (!url.trim()) {
      setError('يرجى إدخال رابط الفيديو / الريل')
      return
    }

    try {
      detectAndValidateReelUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'الرابط غير مدعوم أو غير صالح')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const targetUrl = isEditing ? `/api/admin/reels/${reel!.id}` : '/api/admin/reels'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          titleAr: titleAr || null,
          titleEn: titleEn || null,
          descriptionAr: descAr || null,
          descriptionEn: descEn || null,
          sortOrder: Number(sortOrder) || 0,
          isPublished,
          isFeatured,
        }),
      })

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as Record<string, string>
        throw new Error(json.error ?? 'حدث خطأ أثناء الحفظ')
      }

      startTransition(() => {
        router.push('/admin/reels')
        router.refresh()
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!reel || !confirm('هل أنت متأكد من حذف هذا المقطع؟')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/reels/${reel.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('فشل الحذف')
      startTransition(() => {
        router.push('/admin/reels')
        router.refresh()
      })
    } catch {
      setError('فشل الحذف. حاول مرة أخرى.')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl" noValidate>
      <div className="flex flex-col gap-5">
        {/* URL Input */}
        <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF7F2] p-4">
          <label htmlFor="reelUrl" className={labelClass}>
            رابط الفيديو / الريل من منصات التواصل <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="reelUrl"
            type="url"
            required
            dir="ltr"
            placeholder="https://www.instagram.com/reel/... أو https://youtube.com/shorts/... أو TikTok أو Facebook"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`${inputClass} font-mono text-sm`}
            aria-required="true"
          />

          {/* Validation Feedback & Detected Platform */}
          {detected && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-800">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  {PROVIDER_META[detected.provider].icon}
                </span>
                <span>
                  تم التعرف على المنصة:{' '}
                  <strong>{PROVIDER_META[detected.provider].nameAr}</strong> ({PROVIDER_META[detected.provider].name})
                </span>
              </div>
              <span className="font-mono text-xs opacity-70">ID: {detected.contentId}</span>
            </div>
          )}

          {urlError && url.trim().length > 0 && (
            <p className="mt-2 text-xs font-medium text-amber-700">⚠️ {urlError}</p>
          )}

          <p className="mt-2 text-xs text-[#8A7968]">
            المنصات المدعومة: <strong>Instagram</strong>, <strong>YouTube Shorts & Videos</strong>, <strong>TikTok</strong>, <strong>Facebook Reels</strong>.
          </p>
        </div>

        {/* Titles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="titleAr" className={labelClass}>
              العنوان بالعربية (اختياري)
            </label>
            <input
              id="titleAr"
              type="text"
              placeholder="مثال: نحت مبخرة خشب الجوز"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="titleEn" className={labelClass}>
              العنوان بالإنجليزية (اختياري)
            </label>
            <input
              id="titleEn"
              type="text"
              dir="ltr"
              placeholder="e.g. Carving Walnut Incense Burner"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="descAr" className={labelClass}>
              الوصف بالعربية (اختياري)
            </label>
            <textarea
              id="descAr"
              rows={3}
              placeholder="تفاصيل عن كواليس العمل أو نوع الخشب المستخدم..."
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label htmlFor="descEn" className={labelClass}>
              الوصف بالإنجليزية (اختياري)
            </label>
            <textarea
              id="descEn"
              rows={3}
              dir="ltr"
              placeholder="Craft details or wood species used..."
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Sort order & switches */}
        <div className="grid gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-4 sm:grid-cols-3">
          <div>
            <label htmlFor="sortOrder" className={labelClass}>
              ترتيب العرض
            </label>
            <input
              id="sortOrder"
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className={inputClass}
            />
            <span className="text-[11px] text-[#A09080]">الرقم الأقل يظهر أولاً</span>
          </div>

          <div className="flex items-center sm:pt-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded accent-[#2C1810]"
              />
              <span className="text-sm font-medium text-[#1A1209]">منشور في الموقع</span>
            </label>
          </div>

          <div className="flex items-center sm:pt-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-5 w-5 rounded accent-[#2C1810]"
              />
              <span className="text-sm font-medium text-[#1A1209]">مقطع مميز ⭐</span>
            </label>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-200">
            {error}
          </p>
        )}

        {/* Form Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[#E8DDD0] pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-[44px] items-center rounded-xl bg-[#2C1810] px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'جارٍ الحفظ…' : isEditing ? 'حفظ التعديلات' : 'إضافة المقطع'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex min-h-[44px] items-center rounded-xl border border-[#E8DDD0] px-5 text-sm font-medium text-[#6B5C4E] transition-colors hover:border-[#C4854A]"
          >
            إلغاء
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="me-auto flex min-h-[44px] items-center rounded-xl bg-red-50 px-5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              {deleting ? 'جارٍ الحذف…' : 'حذف المقطع'}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
