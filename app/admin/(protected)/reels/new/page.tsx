import Link from 'next/link'
import ReelForm from '@/components/admin/ReelForm'

export default function NewReelPage() {
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <div className="mb-6">
        <Link
          href="/admin/reels"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#8A7968] transition hover:text-[#2C1810]"
        >
          <span>→</span> العودة إلى قائمة الريلز
        </Link>
        <h1 className="text-2xl font-bold text-[#1A1209]">إضافة ريلز جديد</h1>
        <p className="mt-1 text-sm text-[#6B5C4E]">
          الصق رابط المقطع من Instagram أو YouTube أو TikTok أو Facebook وسيتعرف النظام عليه تلقائياً.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E8DDD0] bg-white p-6 shadow-sm">
        <ReelForm />
      </div>
    </div>
  )
}
