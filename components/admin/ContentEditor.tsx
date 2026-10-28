'use client'

import { useState } from 'react'
import type { SiteContent } from '@/lib/types'
import { Button, Alert, Spinner } from '@heroui/react'
import { adminInputCls } from '@/components/admin/FormField'

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

export default function ContentEditor({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(key: string, lang: 'ar' | 'en', value: string) {
    setContent((prev) => ({
      ...prev,
      [key]: { ...prev[key], key, [lang === 'ar' ? 'valueAr' : 'valueEn']: value } as SiteContent,
    }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error(((await res.json()) as Record<string, string>).error ?? 'حدث خطأ')
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-5">
        {CONTENT_FIELDS.map((field) => {
          const c = content[field.key]
          return (
            <div key={field.key} className="furnish-card p-4">
              <p className="mb-3 font-bold text-[#11100e] dark:text-[#f6f5f4]">{field.label}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#615b51] dark:text-[#a8a196]">عربي</label>
                  <textarea rows={2} value={c?.valueAr ?? ''}
                    onChange={(e) => handleChange(field.key, 'ar', e.target.value)}
                    className={`${adminInputCls} resize-none`} placeholder="النص بالعربية" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#615b51] dark:text-[#a8a196]">English</label>
                  <textarea rows={2} dir="ltr" value={c?.valueEn ?? ''}
                    onChange={(e) => handleChange(field.key, 'en', e.target.value)}
                    className={`${adminInputCls} resize-none`} placeholder="English text" />
                </div>
              </div>
            </div>
          )
        })}

        {saved && (
          <Alert.Root status="success" role="status">
            <Alert.Indicator />
            <Alert.Content><Alert.Title>تم حفظ التغييرات بنجاح</Alert.Title></Alert.Content>
          </Alert.Root>
        )}
        {error && (
          <Alert.Root status="danger" role="alert">
            <Alert.Indicator />
            <Alert.Content><Alert.Title>{error}</Alert.Title></Alert.Content>
          </Alert.Root>
        )}

        <div className="border-t border-[#ecebe9] dark:border-[#2a2723] pt-4">
          <Button variant="primary" isDisabled={saving} onPress={handleSave} aria-busy={saving} className="rounded-none font-bold min-h-[44px] px-8">
            {saving ? <><Spinner size="sm" className="me-2" /><span>جارٍ الحفظ…</span></> : 'حفظ جميع التغييرات'}
          </Button>
        </div>
      </div>
    </div>
  )
}
