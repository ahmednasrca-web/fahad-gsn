'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Reel } from '@/lib/types'
import { detectAndValidateReelUrl, PROVIDER_META, type ReelValidationResult } from '@/lib/reels/providers'
import { Button, Switch, Alert, Spinner } from '@heroui/react'
import { adminInputCls } from '@/components/admin/FormField'

interface Props {
  reel?: Reel
}

const labelCls = 'mb-1.5 block text-sm font-bold text-[#11100e] dark:text-[#f6f5f4]'

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
      try { return detectAndValidateReelUrl(reel.originalUrl) } catch { return null }
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
    if (!newUrl.trim()) { setDetected(null); setUrlError(null); return }
    try {
      setDetected(detectAndValidateReelUrl(newUrl))
      setUrlError(null)
    } catch (err) {
      setDetected(null)
      setUrlError(err instanceof Error ? err.message : 'رابط غير صالح')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    if (!url.trim()) { setError('يرجى إدخال رابط الفيديو / الريل'); return }
    try { detectAndValidateReelUrl(url) }
    catch (err) { setError(err instanceof Error ? err.message : 'الرابط غير مدعوم أو غير صالح'); return }
    setSaving(true); setError(null)
    try {
      const targetUrl = isEditing ? `/api/admin/reels/${reel!.id}` : '/api/admin/reels'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, titleAr: titleAr || null, titleEn: titleEn || null,
          descriptionAr: descAr || null, descriptionEn: descEn || null,
          sortOrder: Number(sortOrder) || 0, isPublished, isFeatured }),
      })
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as Record<string, string>
        throw new Error(json.error ?? 'حدث خطأ أثناء الحفظ')
      }
      startTransition(() => { router.push('/admin/reels'); router.refresh() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!reel || !confirm('هل أنت متأكد من حذف هذا المقطع؟')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/reels/${reel.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('فشل الحذف')
      startTransition(() => { router.push('/admin/reels'); router.refresh() })
    } catch {
      setError('فشل الحذف. حاول مرة أخرى.')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl" noValidate>
      <div className="flex flex-col gap-5">

        {/* URL Input */}
        <div className="furnish-card p-4">
          <label htmlFor="reelUrl" className={labelCls}>
            رابط الفيديو / الريل من منصات التواصل <span className="text-[#d47f31]" aria-hidden="true">*</span>
          </label>
          <input id="reelUrl" type="url" required dir="ltr"
            placeholder="https://www.instagram.com/reel/... أو https://youtube.com/shorts/..."
            value={url} onChange={(e) => handleUrlChange(e.target.value)}
            className={`${adminInputCls} font-mono text-sm`} aria-required="true" />
          {detected && (
            <div className="mt-3 flex items-center justify-between border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">{PROVIDER_META[detected.provider].icon}</span>
                <span>تم التعرف على المنصة: <strong>{PROVIDER_META[detected.provider].nameAr}</strong> ({PROVIDER_META[detected.provider].name})</span>
              </div>
              <span className="font-mono text-xs opacity-70">ID: {detected.contentId}</span>
            </div>
          )}
          {urlError && url.trim().length > 0 && (
            <p className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">⚠️ {urlError}</p>
          )}
          <p className="mt-2 text-xs text-[#615b51] dark:text-[#a8a196]">
            المنصات المدعومة: <strong>Instagram</strong>, <strong>YouTube Shorts & Videos</strong>, <strong>TikTok</strong>, <strong>Facebook Reels</strong>.
          </p>
        </div>

        {/* Titles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="titleAr" className={labelCls}>العنوان بالعربية (اختياري)</label>
            <input id="titleAr" type="text" placeholder="مثال: نحت مبخرة خشب الجوز"
              value={titleAr} onChange={(e) => setTitleAr(e.target.value)} className={adminInputCls} />
          </div>
          <div>
            <label htmlFor="titleEn" className={labelCls}>العنوان بالإنجليزية (اختياري)</label>
            <input id="titleEn" type="text" dir="ltr" placeholder="e.g. Carving Walnut Incense Burner"
              value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={adminInputCls} />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="descAr" className={labelCls}>الوصف بالعربية (اختياري)</label>
            <textarea id="descAr" rows={3} placeholder="تفاصيل عن كواليس العمل..."
              value={descAr} onChange={(e) => setDescAr(e.target.value)} className={`${adminInputCls} resize-none`} />
          </div>
          <div>
            <label htmlFor="descEn" className={labelCls}>الوصف بالإنجليزية (اختياري)</label>
            <textarea id="descEn" rows={3} dir="ltr" placeholder="Craft details or wood species used..."
              value={descEn} onChange={(e) => setDescEn(e.target.value)} className={`${adminInputCls} resize-none`} />
          </div>
        </div>

        {/* Sort order & switches */}
        <div className="grid gap-4 furnish-card p-4 sm:grid-cols-3">
          <div>
            <label htmlFor="sortOrder" className={labelCls}>ترتيب العرض</label>
            <input id="sortOrder" type="number" min={0} value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className={adminInputCls} />
            <span className="text-[11px] text-[#615b51] dark:text-[#a8a196]">الرقم الأقل يظهر أولاً</span>
          </div>

          <div className="flex items-center sm:pt-6">
            <Switch.Root isSelected={isPublished}
              onChange={(v) => setIsPublished(v)}
              className="flex items-center gap-3 cursor-pointer">
              <Switch.Content>
                <Switch.Control />
                <Switch.Thumb />
              </Switch.Content>
              <span className="text-sm font-medium text-[#11100e] dark:text-[#f6f5f4]">منشور في الموقع</span>
            </Switch.Root>
          </div>

          <div className="flex items-center sm:pt-6">
            <Switch.Root isSelected={isFeatured}
              onChange={(v) => setIsFeatured(v)}
              className="flex items-center gap-3 cursor-pointer">
              <Switch.Content>
                <Switch.Control />
                <Switch.Thumb />
              </Switch.Content>
              <span className="text-sm font-medium text-[#11100e] dark:text-[#f6f5f4]">مقطع مميز ⭐</span>
            </Switch.Root>
          </div>
        </div>

        {error && (
          <Alert.Root status="danger" role="alert">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{error}</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        )}

        {/* Form Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[#ecebe9] dark:border-[#2a2723] pt-4">
          <Button type="submit" variant="primary" isDisabled={saving} aria-busy={saving} className="min-h-[44px] px-8 rounded-none font-bold">
            {saving ? <><Spinner size="sm" className="me-2" /><span>جارٍ الحفظ…</span></> : isEditing ? 'حفظ التعديلات' : 'إضافة المقطع'}
          </Button>
          <Button type="button" variant="outline" onPress={() => router.back()} className="min-h-[44px] rounded-none font-bold">إلغاء</Button>
          {isEditing && (
            <Button type="button" variant="danger" isDisabled={deleting}
              onPress={handleDelete} className="me-auto min-h-[44px] rounded-none font-bold" aria-busy={deleting}>
              {deleting ? 'جارٍ الحذف…' : 'حذف المقطع'}
            </Button>
          )}
        </div>

      </div>
    </form>
  )
}
