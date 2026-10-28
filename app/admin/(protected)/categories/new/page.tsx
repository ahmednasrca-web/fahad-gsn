import CategoryForm from '@/components/admin/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#11100e] dark:text-[#f6f5f4]">إضافة تصنيف جديد</h1>
      <CategoryForm />
    </div>
  )
}
