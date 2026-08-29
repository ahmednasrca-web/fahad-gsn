import { notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'
import { getCategoryByIdAdmin } from '@/lib/db/categories'

export const dynamic = 'force-dynamic'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await getCategoryByIdAdmin(id)
  if (!category) notFound()
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#1A1209]">تعديل: {category.nameAr}</h1>
      <CategoryForm category={category} />
    </div>
  )
}
