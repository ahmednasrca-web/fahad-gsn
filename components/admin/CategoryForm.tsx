'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/types'
import { Button, Switch, Alert, Spinner } from '@heroui/react'

import FormField, { adminInputCls } from '@/components/admin/FormField'

interface Props { category?: Category }

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
    setSaving(true); setError(null)
    try {
      const url = isEditing ? `/api/admin/categories/${category!.id}` : '/api/admin/categories'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameAr, nameEn, descriptionAr: descAr, descriptionEn: descEn, isActive }),
      })
      if (!res.ok) throw new Error(((await res.json()) as Record<string, string>).error ?? 'حدث خطأ')
      router.push('/admin/categories'); router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!category || !confirm('حذف هذا التصنيف؟ ستفقد ارتباطه بالأعمال.')) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
      router.push('/admin/categories'); router.refresh()
    } catch {
      setError('فشل الحذف.'); setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl" noValidate>
      <div className="flex flex-col gap-4">
        <FormField id="nameAr" label="الاسم بالعربية" required>
          <input id="nameAr" type="text" required value={nameAr}
            onChange={(e) => setNameAr(e.target.value)} className={adminInputCls} aria-required="true" />
        </FormField>
        <FormField id="nameEn" label="الاسم بالإنجليزية" required>
          <input id="nameEn" type="text" required dir="ltr" value={nameEn}
            onChange={(e) => setNameEn(e.target.value)} className={adminInputCls} aria-required="true" />
        </FormField>
        <FormField id="descAr" label="الوصف بالعربية (اختياري)">
          <textarea id="descAr" rows={3} value={descAr}
            onChange={(e) => setDescAr(e.target.value)} className={`${adminInputCls} resize-none`} />
        </FormField>
        <FormField id="descEn" label="الوصف بالإنجليزية (اختياري)">
          <textarea id="descEn" rows={3} dir="ltr" value={descEn}
            onChange={(e) => setDescEn(e.target.value)} className={`${adminInputCls} resize-none`} />
        </FormField>

        <Switch.Root isSelected={isActive} onChange={(v) => setIsActive(v)}
          className="flex items-center gap-3 cursor-pointer">
          <Switch.Content>
            <Switch.Control />
            <Switch.Thumb />
          </Switch.Content>
          <span className="text-sm font-medium text-[#1A1209]">نشط (يظهر في الموقع)</span>
        </Switch.Root>

        {error && (
          <Alert.Root status="danger" role="alert">
            <Alert.Indicator />
            <Alert.Content><Alert.Title>{error}</Alert.Title></Alert.Content>
          </Alert.Root>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-[#E8DDD0] pt-4">
          <Button type="submit" variant="primary" isDisabled={saving} aria-busy={saving}>
            {saving ? <><Spinner size="sm" className="me-2" /><span>جارٍ الحفظ…</span></> : isEditing ? 'حفظ' : 'إضافة'}
          </Button>
          <Button type="button" variant="outline" onPress={() => router.back()}>إلغاء</Button>
          {isEditing && (
            <Button type="button" variant="danger" isDisabled={deleting}
              onPress={handleDelete} className="me-auto" aria-busy={deleting}>
              {deleting ? 'جارٍ الحذف…' : 'حذف'}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

