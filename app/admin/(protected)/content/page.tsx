import { getSiteContent } from '@/lib/db/content'
import ContentEditor from '@/components/admin/ContentEditor'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const content = await getSiteContent()
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#1A1209]">محتوى الموقع</h1>
      <p className="mb-6 text-sm text-[#6B5C4E]">عدّل نصوص الموقع هنا. يمكنك تركها فارغة لاستخدام النص الافتراضي.</p>
      <ContentEditor initialContent={content} />
    </div>
  )
}
