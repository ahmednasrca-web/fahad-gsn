export const runtime = 'edge'

import { notFound } from 'next/navigation'
import WorkForm from '@/components/admin/WorkForm'
import { getWorkByIdAdmin } from '@/lib/db/works'
import { getAllCategoriesAdmin } from '@/lib/db/categories'

export const dynamic = 'force-dynamic'

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [work, categories] = await Promise.all([
    getWorkByIdAdmin(id),
    getAllCategoriesAdmin(),
  ])
  if (!work) notFound()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#1A1209]">تعديل: {work.titleAr}</h1>
      <WorkForm work={work} categories={categories} />
    </div>
  )
}
