export const runtime = 'edge'

import CategoryForm from '@/components/admin/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#1A1209]">إضافة تصنيف جديد</h1>
      <CategoryForm />
    </div>
  )
}
