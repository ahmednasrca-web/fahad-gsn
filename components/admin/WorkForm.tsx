'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Work, Category, SculpturalHotspot, SculptorVision, PhysicalSpecs, FocalPoint } from '@/lib/types'
import { Button, Switch, Alert, Spinner } from '@heroui/react'
import MediaQualityInspector from './MediaQualityInspector'
import FocalPointPicker from './FocalPointPicker'
import HotspotEditorModal from './HotspotEditorModal'
import SculptorVisionEditor from './SculptorVisionEditor'
import Field, { adminInputCls as inputCls } from '@/components/admin/FormField'

interface Props {
  work?: Work
  categories: Category[]
}

interface FormState {
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  storyAr: string
  storyEn: string
  categoryId: string
  price: string
  isPublished: boolean
  isFeatured: boolean
  isUniquePiece: boolean
}

export default function WorkForm({ work, categories }: Props) {
  const router = useRouter()
  const isEditing = !!work
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    titleAr: work?.titleAr ?? '',
    titleEn: work?.titleEn ?? '',
    descriptionAr: work?.descriptionAr ?? '',
    descriptionEn: work?.descriptionEn ?? '',
    storyAr: work?.storyAr ?? '',
    storyEn: work?.storyEn ?? '',
    categoryId: work?.category?.id ?? '',
    price: work?.price?.toString() ?? '',
    isPublished: work?.isPublished ?? false,
    isFeatured: work?.isFeatured ?? false,
    isUniquePiece: work?.isUniquePiece ?? false,
  })

  const [images, setImages] = useState<string[]>(work?.images ?? [])
  const [focalPoint, setFocalPoint] = useState<FocalPoint>(work?.focalPoint ?? { x: 50, y: 50 })
  const [hotspots, setHotspots] = useState<SculpturalHotspot[]>(work?.hotspots ?? [])
  const [sculptorVision, setSculptorVision] = useState<SculptorVision | undefined>(work?.sculptorVision)
  const [physicalSpecs, setPhysicalSpecs] = useState<PhysicalSpecs>(work?.physicalSpecs ?? {
    lengthCm: 240,
    widthCm: 100,
    heightCm: 76,
    thicknessMm: 65,
    weightKg: 100,
    finishDetailsAr: 'زيوت عضوية إيطالية مطفية (Matte Satin) + شمع نحل طبيعي 100%',
    finishDetailsEn: 'Organic Italian matte satin oils + 100% pure raw beeswax shield',
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSpecChange(field: keyof PhysicalSpecs, value: string | number) {
    setPhysicalSpecs((prev) => ({ ...prev, [field]: value }))
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
    if (images.length === 0) {
      setError('يجب إضافة صورة واحدة على الأقل للعمل')
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
      focalPoint,
      hotspots: hotspots.length > 0 ? hotspots : undefined,
      sculptorVision: sculptorVision?.rawImage ? sculptorVision : undefined,
      physicalSpecs,
    }
    try {
      const url = isEditing ? `/api/admin/works/${work!.id}` : '/api/admin/works'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as Record<string, string>
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

  // Pre-Publish Verification Checklist Status
  const hasImages = images.length > 0
  const hasTitles = !!form.titleAr.trim() && !!form.titleEn.trim()
  const hasSpecs = !!physicalSpecs.lengthCm && !!physicalSpecs.widthCm
  const hasCategory = !!form.categoryId
  const isReadyForPublish = hasImages && hasTitles

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl" noValidate>
      <div className="flex flex-col gap-6">

        {/* ── Pre-Publish Health & Verification Bar ── */}
        <div className="furnish-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] flex items-center gap-2">
                <span>📋</span>
                <span>تدقيق ما قبل النشر (Pre-Publish Health Check)</span>
              </h3>
              <p className="text-xs text-[#615b51] dark:text-[#a8a196] mt-0.5">
                تأكد من اكتمال كافة المتطلبات لضمان أعلى جودة ظهور أمام العملاء.
              </p>
            </div>
            <span className={`px-2.5 py-1 text-xs font-bold ${isReadyForPublish ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-[#d47f31]/10 text-[#d47f31] border border-[#d47f31]/30'}`}>
              {isReadyForPublish ? '✓ جاهز للنشر' : '⏳ يرجى إكمال الحقول الأساسية'}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${hasImages ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8a8377]'}`}>
              <span>{hasImages ? '✓' : '○'}</span>
              <span>الصور ({images.length})</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasTitles ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8a8377]'}`}>
              <span>{hasTitles ? '✓' : '○'}</span>
              <span>العناوين (AR/EN)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasSpecs ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8a8377]'}`}>
              <span>{hasSpecs ? '✓' : '○'}</span>
              <span>المقاسات الهندسية</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasCategory ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8a8377]'}`}>
              <span>{hasCategory ? '✓' : '○'}</span>
              <span>التصنيف المعتمد</span>
            </div>
          </div>
        </div>

        {/* Titles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="titleAr" label="العنوان بالعربية" required>
            <input id="titleAr" type="text" required value={form.titleAr}
              onChange={(e) => handleChange('titleAr', e.target.value)}
              className={inputCls} aria-required="true" />
          </Field>
          <Field id="titleEn" label="العنوان بالإنجليزية" required>
            <input id="titleEn" type="text" required dir="ltr" value={form.titleEn}
              onChange={(e) => handleChange('titleEn', e.target.value)}
              className={inputCls} aria-required="true" />
          </Field>
        </div>

        {/* Descriptions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="descAr" label="الوصف والمواصفات بالعربية">
            <textarea id="descAr" rows={3} value={form.descriptionAr}
              onChange={(e) => handleChange('descriptionAr', e.target.value)}
              className={`${inputCls} resize-none`} />
          </Field>
          <Field id="descEn" label="الوصف والمواصفات بالإنجليزية">
            <textarea id="descEn" rows={3} dir="ltr" value={form.descriptionEn}
              onChange={(e) => handleChange('descriptionEn', e.target.value)}
              className={`${inputCls} resize-none`} />
          </Field>
        </div>

        {/* Woodcraft Story */}
        <div className="furnish-card p-4 border-l-4 border-l-[#d47f31]">
          <p className="mb-3 text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] flex items-center gap-2">
            <span>🪵</span> حكاية القطعة وتفاصيل الخشب (Story Behind the Craft)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="storyAr" label="قصة القطعة — بالعربية">
              <textarea id="storyAr" rows={3} value={form.storyAr}
                placeholder="مثال: صُنعت هذه الطاولة من جذع جوز أمريكي معتق تم تجفيفه لثلاث سنوات..."
                onChange={(e) => handleChange('storyAr', e.target.value)}
                className={`${inputCls} resize-none`} />
            </Field>
            <Field id="storyEn" label="قصة القطعة — بالإنجليزية">
              <textarea id="storyEn" rows={3} dir="ltr" value={form.storyEn}
                placeholder="e.g. Handcrafted from a rare single-slab American Walnut..."
                onChange={(e) => handleChange('storyEn', e.target.value)}
                className={`${inputCls} resize-none`} />
            </Field>
          </div>
        </div>

        {/* ── Physical Dimensions & Specs Matrix ── */}
        <div className="furnish-card p-5">
          <h4 className="mb-3 text-sm font-bold text-[#11100e] dark:text-[#f6f5f4] flex items-center gap-2">
            <span>📐</span>
            <span>مصفوفة المقاسات والأبعاد الفيزيائية الحقيقية (Physical Specs)</span>
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">الطول (سم)</label>
              <input type="number" value={physicalSpecs.lengthCm ?? ''}
                onChange={(e) => handleSpecChange('lengthCm', parseFloat(e.target.value) || 0)}
                placeholder="240" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">العرض (سم)</label>
              <input type="number" value={physicalSpecs.widthCm ?? ''}
                onChange={(e) => handleSpecChange('widthCm', parseFloat(e.target.value) || 0)}
                placeholder="100" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">الارتفاع (سم)</label>
              <input type="number" value={physicalSpecs.heightCm ?? ''}
                onChange={(e) => handleSpecChange('heightCm', parseFloat(e.target.value) || 0)}
                placeholder="76" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">سُمك اللوح (مم)</label>
              <input type="number" value={physicalSpecs.thicknessMm ?? ''}
                onChange={(e) => handleSpecChange('thicknessMm', parseFloat(e.target.value) || 0)}
                placeholder="65" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">الوزن (كجم)</label>
              <input type="number" value={physicalSpecs.weightKg ?? ''}
                onChange={(e) => handleSpecChange('weightKg', parseFloat(e.target.value) || 0)}
                placeholder="110" className={inputCls} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">نوع الزيوت والتشطيب (بالعربي)</label>
              <input type="text" value={physicalSpecs.finishDetailsAr ?? ''}
                onChange={(e) => handleSpecChange('finishDetailsAr', e.target.value)}
                placeholder="زيوت عضوية إيطالية مطفية + شمع نحل طبيعي" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#11100e] dark:text-[#f6f5f4]">نوع التشطيب (بالإنجليزية)</label>
              <input type="text" value={physicalSpecs.finishDetailsEn ?? ''}
                onChange={(e) => handleSpecChange('finishDetailsEn', e.target.value)}
                placeholder="Italian organic matte satin oils + raw beeswax" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Category + Price */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="categoryId" label="التصنيف">
            <select id="categoryId" value={form.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              className={inputCls}>
              <option value="">بلا تصنيف</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
              ))}
            </select>
          </Field>
          <Field id="price" label="السعر (د.ك) — اختياري">
            <input id="price" type="number" min="0" step="0.001" dir="ltr" value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className={inputCls} placeholder="0.000" />
          </Field>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 furnish-card p-4">
          <Switch.Root
            isSelected={form.isPublished}
            onChange={(v) => handleChange('isPublished', v)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Switch.Content>
              <Switch.Control className="switch-control" />
              <Switch.Thumb />
            </Switch.Content>
            <span className="text-sm font-medium text-[#11100e] dark:text-[#f6f5f4]">منشور بالموقع</span>
          </Switch.Root>

          <Switch.Root
            isSelected={form.isFeatured}
            onChange={(v) => handleChange('isFeatured', v)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Switch.Content>
              <Switch.Control />
              <Switch.Thumb />
            </Switch.Content>
            <span className="text-sm font-medium text-[#11100e] dark:text-[#f6f5f4]">⭐ مميز في الرئيسية</span>
          </Switch.Root>

          <Switch.Root
            isSelected={form.isUniquePiece}
            onChange={(v) => handleChange('isUniquePiece', v)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Switch.Content>
              <Switch.Control />
              <Switch.Thumb />
            </Switch.Content>
            <span className="text-sm font-bold text-[#d47f31]">قطعة فريدة حصرية (Exclusive Piece)</span>
          </Switch.Root>
        </div>

        {/* Images & Live Quality Inspector */}
        <div className="furnish-card p-5">
          <p className="mb-2 text-sm font-bold text-[#11100e] dark:text-[#f6f5f4]">
            معرض الصور وفاحص الدقة والمقاسات (Media Studio)
          </p>

          {images.length > 0 && (
            <div className="mb-4 space-y-3">
              {/* Primary Image Quality Inspector */}
              <div className="border border-[#ecebe9] dark:border-[#2a2723] p-3 bg-[#f6f5f4] dark:bg-[#161513]">
                <p className="text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] mb-1.5">
                  فحص الصورة الأساسية (Primary 4K Image)
                </p>
                <MediaQualityInspector imageUrl={images[0]} />
              </div>

              {/* Thumbnails list */}
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {images.map((img, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden border border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#211f1c]">
                    <Image src={img} alt={`صورة ${i + 1}`} fill sizes="120px" className="object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 cursor-pointer"
                      aria-label={`حذف الصورة ${i + 1}`}>
                      <span className="text-2xl text-white font-bold" aria-hidden="true">✕</span>
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 start-1 bg-[#d47f31] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        الرئيسية
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple
            onChange={handleImageUpload} className="sr-only" id="image-upload" />
          <label htmlFor="image-upload"
            className={`flex min-h-[52px] cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#161513] px-4 text-sm font-bold text-[#615b51] dark:text-[#a8a196] transition-colors hover:border-[#d47f31] hover:text-[#d47f31] ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
            {uploading ? <><Spinner size="sm" /><span>جارٍ الرفع والفحص…</span></> : '📸 + إضافة وفحص صور جديدة'}
          </label>
        </div>

        {/* ── Focal Point Picker (if images exist) ── */}
        {images.length > 0 && (
          <FocalPointPicker
            imageUrl={images[0]}
            focalPoint={focalPoint}
            onChange={setFocalPoint}
          />
        )}

        {/* ── Sculptural Hotspots Editor ── */}
        {images.length > 0 && (
          <HotspotEditorModal
            imageUrl={images[0]}
            hotspots={hotspots}
            onChange={setHotspots}
          />
        )}

        {/* ── Sculptor Vision Editor ── */}
        <SculptorVisionEditor
          vision={sculptorVision}
          onChange={setSculptorVision}
        />

        {/* Error Alert */}
        {error && (
          <Alert.Root status="danger" role="alert">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{error}</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[#ecebe9] dark:border-[#2a2723] pt-4">
          <Button type="submit" variant="primary" isDisabled={saving || uploading}
            aria-busy={saving} className="min-h-[44px] px-8 font-bold rounded-none">
            {saving ? <><Spinner size="sm" className="me-2" /><span>جارٍ الحفظ…</span></> : isEditing ? 'حفظ كافة التعديلات' : 'نشر العمل بالمشغل'}
          </Button>
          <Button type="button" variant="outline" onPress={() => router.back()} className="min-h-[44px] font-bold rounded-none">
            إلغاء
          </Button>
          {isEditing && (
            <Button type="button" variant="danger" isDisabled={deleting}
              onPress={handleDelete} className="me-auto min-h-[44px] font-bold rounded-none" aria-busy={deleting}>
              {deleting ? 'جارٍ الحذف…' : 'حذف العمل'}
            </Button>
          )}
        </div>

      </div>
    </form>
  )
}
