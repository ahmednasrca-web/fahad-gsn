import { getSiteContent } from '@/lib/db/content'
import ContentEditor from '@/components/admin/ContentEditor'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const content = await getSiteContent()
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <div className="mb-6 border-b border-[#ecebe9] dark:border-[#2a2723] pb-5">
        <span className="furnish-subheading">إدارة النصوص والعبارات</span>
        <h1 className="text-2xl font-bold tracking-tight text-[#11100e] dark:text-[#f6f5f4]">محتوى الموقع</h1>
        <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">عدّل نصوص الموقع هنا. يمكنك تركها فارغة لاستخدام النص الافتراضي.</p>
      </div>
      <ContentEditor initialContent={content} />
    </div>
  )
}
