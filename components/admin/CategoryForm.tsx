'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/types'

interface Props { category?: Category }

const inputClass = 'w-full rounded-xl border border-[#E8DDD0] bg-white px-4 py-3 text-[15px] text-[#1A1209] outline-none transition focus:border-[#2C1810] focus:ring-2 focus:ring-[#2C1810]/10 placeholder:text-[#A09080]'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#1A1209]'

export default function CategoryForm({ category }: Props) {
  const router = useRouter()
  const isEditing = !!category
  const [nameAr, setNameAr] = useState(category?.nameAr ?? '')
  const [nameEn, setNameEn] = useState(category?.nameEn ?? '')
  const [descAr, setDescAr] = useState(category?.descriptionAr ?? '')
  const [descEn, setDescEn] = useState(category?.descriptionEn ?? '')
  const [isActive, setIsActive] = useState(category?.isActive ?? true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      const url = isEditing ? `/api/admin/categories/${category!.id}` : '/api/admin/categories'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameAr, nameEn, descriptionAr: descAr, descriptionEn: descEn, isActive }),
      })
      if (!res.ok) throw new Error(((await res.json()) as Record<string,string>).error ?? 'حدث خطأ')
      router.push('/admin/categories')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!category || !confirm('حذف هذا التصنيف؟ ستفقد ارتباطه بالأعمال.')) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
      router.push('/admin/categories')
      router.refresh()
    } catch {
      setError('فشل الحذف.')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl" noValidate>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="nameAr" className={labelClass}>الاسم بالعربية <span className="text-red-500" aria-hidden="true">*</span></label>
          <input id="nameAr" type="text" required value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={inputClass} aria-required="true" />
        </div>
        <div>
          <label htmlFor="nameEn" className={labelClass}>الاسم بالإنجليزية <span className="text-red-500" aria-hidden="true">*</span></label>
          <input id="nameEn" type="text" required dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className={inputClass} aria-required="true" />
        </div>
        <div>
          <label htmlFor="descAr" className={labelClass}>الوصف بالعربية (اختياري)</label>
          <textarea id="descAr" rows={3} value={descAr} onChange={(e) => setDescAr(e.target.value)} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label htmlFor="descEn" className={labelClass}>الوصف بالإنجليزية (اختياري)</label>
          <textarea id="descEn" rows={3} dir="ltr" value={descEn} onChange={(e) => setDescEn(e.target.value)} className={`${inputClass} resize-none`} />
        </div>
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-5 w-5 rounded accent-[#2C1810]" />
          <span className="text-sm font-medium text-[#1A1209]">نشط (يظهر في الموقع)</span>
        </label>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap items-center gap-3 border-t border-[#E8DDD0] pt-4">
          <button type="submit" disabled={saving}
            className="flex min-h-[44px] items-center rounded-xl bg-[#2C1810] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'جارٍ الحفظ…' : isEditing ? 'حفظ' : 'إضافة'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="flex min-h-[44px] items-center rounded-xl border border-[#E8DDD0] px-5 text-sm font-medium text-[#6B5C4E] transition-colors hover:border-[#C4854A]"
          >
            إلغاء
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting}
              className="me-auto flex min-h-[44px] items-center rounded-xl bg-red-50 px-5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              {deleting ? 'جارٍ الحذف…' : 'حذف'}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
