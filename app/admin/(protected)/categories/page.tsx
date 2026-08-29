import Link from 'next/link'
import { getAllCategoriesAdmin } from '@/lib/db/categories'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A1209]">التصنيفات</h1>
        <Link href="/admin/categories/new"
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2C1810] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <span aria-hidden="true">+</span>
          إضافة تصنيف
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-[#E8DDD0] bg-white p-12 text-center">
          <p className="text-4xl" aria-hidden="true">📂</p>
          <p className="mt-4 text-lg font-medium text-[#3D2B1A]">لا توجد تصنيفات بعد</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DDD0] bg-[#F5F0E8]">
                <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">الاسم</th>
                <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">الحالة</th>
                <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">تعديل</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} className={`border-b border-[#E8DDD0] hover:bg-[#F5F0E8] ${i === categories.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1A1209]">{cat.nameAr}</p>
                    <p className="text-xs text-[#6B5C4E]">{cat.nameEn}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-[#F0E8D8] text-[#6B3F1F]'}`}>
                      {cat.isActive ? 'نشط' : 'مخفي'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/categories/${cat.id}`}
                      className="rounded-lg border border-[#E8DDD0] px-3 py-1.5 text-xs font-medium text-[#3D2B1A] hover:border-[#C4854A]"
                    >
                      تعديل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
