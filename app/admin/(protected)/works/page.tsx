import Link from 'next/link'
import { getAllWorksAdmin } from '@/lib/db/works'
import { Card, Button } from '@heroui/react'
import WorksListClient from '@/components/admin/WorksListClient'

export const dynamic = 'force-dynamic'

export default async function AdminWorksPage() {
  const works = await getAllWorksAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1209]">معرض الأعمال</h1>
          <p className="text-sm text-[#6B5C4E]">إدارة، ترتيب، وتعديل القطع الخشبية المعروضة في المتجر</p>
        </div>
        <Link href="/admin/works/new">
          <Button variant="primary">
            <span aria-hidden="true">+</span>
            إضافة عمل جديد
          </Button>
        </Link>
      </div>

      {works.length === 0 ? (
        <Card.Root className="border border-[#E8DDD0] bg-white p-12 text-center shadow-xs">
          <Card.Content>
            <p className="text-5xl" aria-hidden="true">🪵</p>
            <p className="mt-4 text-xl font-bold text-[#2C1810]">لا توجد أعمال مضافة بعد</p>
            <p className="mt-1 text-sm text-[#8A7968]">ابدأ بإضافة أول قطعة خشبية لعرضها في المتجر للزوار</p>
            <div className="mt-6">
              <Link href="/admin/works/new">
                <Button variant="primary">
                  + إضافة أول عمل
                </Button>
              </Link>
            </div>
          </Card.Content>
        </Card.Root>
      ) : (
        <WorksListClient initialWorks={works} />
      )}
    </div>
  )
}
