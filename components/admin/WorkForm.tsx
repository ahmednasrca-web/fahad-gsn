'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Work, Category } from '@/lib/types'

interface Props {
  work?: Work
  categories: Category[]
}

interface FormState {
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  categoryId: string
  price: string
  isPublished: boolean
  isFeatured: boolean
}

const inputClass =
  'w-full rounded-xl border border-[#E8DDD0] bg-white px-4 py-3 text-[15px] text-[#1A1209] outline-none transition focus:border-[#2C1810] focus:ring-2 focus:ring-[#2C1810]/10 placeholder:text-[#A09080]'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#1A1209]'

export default function WorkForm({ work, categories }: Props) {
  const router = useRouter()
  const isEditing = !!work
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    titleAr: work?.titleAr ?? '',
    titleEn: work?.titleEn ?? '',
    descriptionAr: work?.descriptionAr ?? '',
    descriptionEn: work?.descriptionEn ?? '',
    categoryId: work?.category?.id ?? '',
    price: work?.price?.toString() ?? '',
    isPublished: work?.isPublished ?? false,
    isFeatured: work?.isFeatured ?? false,
  })

  const [images, setImages] = useState<string[]>(work?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      for (const file of files) {
        const data = new FormData()
        data.append('file', file)
        data.append('type', 'product')
        if (work?.id) data.append('productId', work.id)
        const res = await fetch('/api/upload', { method: 'POST', body: data })
        if (!res.ok) throw new Error('فشل رفع الصورة')
        const json = await res.json() as Record<string, string>
        setImages((prev) => [...prev, json.url])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في الرفع')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving || uploading) return
    if (!form.titleAr.trim() || !form.titleEn.trim()) {
      setError('العنوان بالعربية والإنجليزية مطلوبان')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      categoryId: form.categoryId || null,
      images,
      primaryImage: images[0] ?? null,
    }
    try {
      const url = isEditing ? `/api/admin/works/${work!.id}` : '/api/admin/works'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as Record<string,string>
        throw new Error(json.error ?? 'حدث خطأ')
      }
      router.push('/admin/works')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!work || !confirm('هل أنت متأكد من حذف هذا العمل؟ لا يمكن التراجع.')) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/works/${work.id}`, { method: 'DELETE' })
      router.push('/admin/works')
      router.refresh()
    } catch {
      setError('فشل الحذف. حاول مرة أخرى.')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl" noValidate>
      <div className="flex flex-col gap-6">
        {/* Titles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="titleAr" className={labelClass}>
              العنوان بالعربية <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input id="titleAr" type="text" required value={form.titleAr} onChange={(e) => handleChange('titleAr', e.target.value)} className={inputClass} aria-required="true" />
          </div>
          <div>
            <label htmlFor="titleEn" className={labelClass}>
              العنوان بالإنجليزية <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input id="titleEn" type="text" required dir="ltr" value={form.titleEn} onChange={(e) => handleChange('titleEn', e.target.value)} className={inputClass} aria-required="true" />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="descAr" className={labelClass}>الوصف بالعربية</label>
            <textarea id="descAr" rows={4} value={form.descriptionAr} onChange={(e) => handleChange('descriptionAr', e.target.value)} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label htmlFor="descEn" className={labelClass}>الوصف بالإنجليزية</label>
            <textarea id="descEn" rows={4} dir="ltr" value={form.descriptionEn} onChange={(e) => handleChange('descriptionEn', e.target.value)} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Category + Price */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className={labelClass}>التصنيف</label>
            <select id="categoryId" value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className={inputClass}>
              <option value="">بلا تصنيف</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>السعر (د.ك) — اختياري</label>
            <input id="price" type="number" min="0" step="0.001" dir="ltr" value={form.price} onChange={(e) => handleChange('price', e.target.value)} className={inputClass} placeholder="0.000" />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => handleChange('isPublished', e.target.checked)} className="h-5 w-5 rounded accent-[#2C1810]" />
            <span className="text-sm font-medium text-[#1A1209]">منشور</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} className="h-5 w-5 rounded accent-[#2C1810]" />
            <span className="text-sm font-medium text-[#1A1209]">مميز في الرئيسية</span>
          </label>
        </div>

        {/* Images */}
        <div>
          <p className={labelClass}>الصور</p>
          {images.length > 0 && (
            <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {images.map((img, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-[#F0E8D8]">
                  <Image src={img} alt={`صورة ${i + 1}`} fill sizes="120px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                    aria-label={`حذف الصورة ${i + 1}`}
                  >
                    <span className="text-2xl text-white" aria-hidden="true">×</span>
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 start-1 rounded bg-black/60 px-1 py-0.5 text-xs text-white">رئيسية</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple onChange={handleImageUpload} className="sr-only" id="image-upload" />
          <label
            htmlFor="image-upload"
            className={`flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E8DDD0] px-4 text-sm font-medium text-[#6B5C4E] transition-colors hover:border-[#C4854A] hover:text-[#2C1810] ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            {uploading ? 'جارٍ الرفع…' : '+ إضافة صور'}
          </label>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[#E8DDD0] pt-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex min-h-[44px] items-center rounded-xl bg-[#2C1810] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'جارٍ الحفظ…' : isEditing ? 'حفظ التعديلات' : 'إضافة العمل'}
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
              className="me-auto flex min-h-[44px] items-center rounded-xl bg-red-50 px-5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? 'جارٍ الحذف…' : 'حذف العمل'}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
