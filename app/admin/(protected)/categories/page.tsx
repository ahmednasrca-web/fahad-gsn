import Link from 'next/link'
import { getAllCategoriesAdmin } from '@/lib/db/categories'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ecebe9] dark:border-[#2a2723] pb-5">
        <div>
          <span className="furnish-subheading">هيكلية المنتجات</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#11100e] dark:text-[#f6f5f4]">التصنيفات</h1>
          <p className="mt-1 text-sm text-[#615b51] dark:text-[#a8a196]">إدارة أقسام وتصنيفات الأعمال الخشبية</p>
        </div>
        <Link 
          href="/admin/categories/new"
          className="admin-btn-primary self-start sm:self-auto"
        >
          <span aria-hidden="true">+</span>
          إضافة تصنيف
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="furnish-card p-12 text-center">
          <p className="text-5xl" aria-hidden="true">📂</p>
          <p className="mt-4 text-xl font-bold text-[#11100e] dark:text-[#f6f5f4]">لا توجد تصنيفات بعد</p>
          <div className="mt-6">
            <Link href="/admin/categories/new" className="admin-btn-primary inline-flex">
              + إضافة أول تصنيف
            </Link>
          </div>
        </div>
      ) : (
        <div className="furnish-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#ecebe9] dark:border-[#2a2723] bg-[#f6f5f4] dark:bg-[#161513] text-xs font-bold uppercase tracking-wider text-[#615b51] dark:text-[#a8a196]">
                  <th className="px-6 py-4 text-start">الاسم بالعربية / الإنجليزية</th>
                  <th className="px-6 py-4 text-start">المعرف (Slug)</th>
                  <th className="px-6 py-4 text-start">الحالة</th>
                  <th className="px-6 py-4 text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecebe9] dark:divide-[#2a2723]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-[#f6f5f4]/50 dark:hover:bg-[#211f1c]/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="font-bold text-[#11100e] dark:text-[#f6f5f4] hover:text-[#d47f31] transition-colors"
                      >
                        {cat.nameAr}
                      </Link>
                      <p className="text-xs text-[#615b51] dark:text-[#a8a196] font-mono">{cat.nameEn}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#615b51] dark:text-[#a8a196]">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold ${
                        cat.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                      }`}>
                        {cat.isActive ? 'نشط في المعرض' : 'مخفي'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Link 
                        href={`/admin/categories/${cat.id}`}
                        className="inline-flex items-center border border-[#ecebe9] dark:border-[#2a2723] bg-white dark:bg-[#1a1815] px-3 py-1.5 text-xs font-bold text-[#11100e] dark:text-[#f6f5f4] hover:border-[#11100e] dark:hover:border-[#f6f5f4] transition"
                      >
                        تعديل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
