import Link from 'next/link'
import { getAllReelsAdmin } from '@/lib/db/reels'
import ReelsListClient from '@/components/admin/ReelsListClient'

export const dynamic = 'force-dynamic'

export default async function AdminReelsPage() {
  const reels = await getAllReelsAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ecebe9] dark:border-[#2a2723] pb-5">
        <div>
          <span className="furnish-subheading">إدارة الوسائط الاجتماعية</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#11100e] dark:text-[#f6f5f4]">مقاطع الريلز (Social Videos)</h1>
          <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">
            إدارة وترتيب فيديوهات الريلز المعروضة في المعرض من Instagram, YouTube, TikTok, Facebook
          </p>
        </div>
        <Link 
          href="/admin/reels/new"
          className="admin-btn-primary self-start sm:self-auto"
        >
          <span aria-hidden="true">+</span>
          إضافة ريلز جديد
        </Link>
      </div>

      {reels.length === 0 ? (
        <div className="furnish-card p-12 text-center">
          <p className="text-5xl" aria-hidden="true">🎬</p>
          <p className="mt-4 text-xl font-bold text-[#11100e] dark:text-[#f6f5f4]">لا توجد مقاطع ريلز بعد</p>
          <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">
            أضف أول فيديو لعرض كواليس الحرفة والتشكيل اليدوي للأعمال للزوار
          </p>
          <div className="mt-6">
            <Link href="/admin/reels/new" className="admin-btn-primary inline-flex">
              + أضف أول ريلز
            </Link>
          </div>
        </div>
      ) : (
        <ReelsListClient initialReels={reels} />
      )}
    </div>
  )
}
