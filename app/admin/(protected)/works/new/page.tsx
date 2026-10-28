import WorkForm from '@/components/admin/WorkForm'
import { getAllCategoriesAdmin } from '@/lib/db/categories'

export const dynamic = 'force-dynamic'

export default async function NewWorkPage() {
  const categories = await getAllCategoriesAdmin()
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#11100e] dark:text-[#f6f5f4]">إضافة عمل جديد</h1>
      <WorkForm categories={categories} />
    </div>
  )
}
