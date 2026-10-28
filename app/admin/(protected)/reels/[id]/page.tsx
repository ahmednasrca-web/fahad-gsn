import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getReelByIdAdmin } from '@/lib/db/reels'
import ReelForm from '@/components/admin/ReelForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditReelPage({ params }: Props) {
  const { id } = await params
  const reel = await getReelByIdAdmin(id)
  if (!reel) notFound()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <div className="mb-6 border-b border-[#ecebe9] dark:border-[#211f1c] pb-5">
        <Link
          href="/admin/reels"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#837a6d] hover:text-[#d47f31] transition-colors"
        >
          <span>→</span> العودة إلى قائمة الريلز
        </Link>
        <span className="furnish-subheading block">تحديث المقطع</span>
        <h1 className="text-2xl font-bold text-[#11100e] dark:text-[#f6f5f4] mt-1 font-display">تعديل الريلز</h1>
        <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">
          تعديل تفاصيل المقطع، حالة النشر، أو الترتيب.
        </p>
      </div>

      <div className="furnish-card p-6">
        <ReelForm reel={reel} />
      </div>
    </div>
  )
}
