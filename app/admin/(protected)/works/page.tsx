import Link from 'next/link'
import { getAllWorksAdmin } from '@/lib/db/works'
import WorksListClient from '@/components/admin/WorksListClient'

export const dynamic = 'force-dynamic'

export default async function AdminWorksPage() {
  const works = await getAllWorksAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ecebe9] dark:border-[#2a2723] pb-5">
        <div>
          <span className="furnish-subheading">إدارة المنتجات</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#11100e] dark:text-[#f6f5f4]">معرض الأعمال</h1>
          <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">إدارة، ترتيب، وتعديل القطع الخشبية المعروضة في المتجر</p>
        </div>
        <Link 
          href="/admin/works/new"
          className="admin-btn-primary self-start sm:self-auto"
        >
          <span aria-hidden="true">+</span>
          إضافة عمل جديد
        </Link>
      </div>

      {works.length === 0 ? (
        <div className="furnish-card p-12 text-center">
          <p className="text-5xl" aria-hidden="true">🪵</p>
          <p className="mt-4 text-xl font-bold text-[#11100e] dark:text-[#f6f5f4]">لا توجد أعمال مضافة بعد</p>
          <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">ابدأ بإضافة أول قطعة خشبية لعرضها في المتجر للزوار</p>
          <div className="mt-6">
            <Link href="/admin/works/new" className="admin-btn-primary inline-flex">
              + إضافة أول عمل
            </Link>
          </div>
        </div>
      ) : (
        <WorksListClient initialWorks={works} />
      )}
    </div>
  )
}
