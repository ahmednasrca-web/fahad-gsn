import Link from 'next/link'
import { getAllCategoriesAdmin } from '@/lib/db/categories'
import { Card, Chip, Button } from '@heroui/react'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1209]">التصنيفات</h1>
          <p className="mt-1 text-sm text-[#6B5C4E]">إدارة أقسام وتصنيفات الأعمال الخشبية</p>
        </div>
        <Link href="/admin/categories/new">
          <Button variant="primary">
            <span aria-hidden="true">+</span>
            إضافة تصنيف
          </Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <Card.Root className="border border-[#E8DDD0] bg-white p-12 text-center shadow-xs">
          <Card.Content>
            <p className="text-5xl" aria-hidden="true">📂</p>
            <p className="mt-4 text-xl font-bold text-[#2C1810]">لا توجد تصنيفات بعد</p>
            <div className="mt-6">
              <Link href="/admin/categories/new">
                <Button variant="primary">+ إضافة أول تصنيف</Button>
              </Link>
            </div>
          </Card.Content>
        </Card.Root>
      ) : (
        <Card.Root className="border border-[#E8DDD0] bg-white overflow-hidden shadow-xs">
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2] text-xs font-semibold text-[#8A7968]">
                    <th className="px-6 py-4 text-start">الاسم بالعربية / الإنجليزية</th>
                    <th className="px-6 py-4 text-start">المعرف (Slug)</th>
                    <th className="px-6 py-4 text-start">الحالة</th>
                    <th className="px-6 py-4 text-end">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="transition-colors hover:bg-[#FAF7F2]/60">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/categories/${cat.id}`}
                          className="font-bold text-[#1A1209] hover:text-[#C4854A] transition-colors"
                        >
                          {cat.nameAr}
                        </Link>
                        <p className="text-xs text-[#8A7968] font-mono">{cat.nameEn}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#6B5C4E]">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4">
                        <Chip.Root
                          color={cat.isActive ? 'success' : 'default'}
                          size="sm"
                          variant="soft"
                        >
                          <Chip.Label>{cat.isActive ? 'نشط في المعرض' : 'مخفي'}</Chip.Label>
                        </Chip.Root>
                      </td>
                      <td className="px-6 py-4 text-end">
                        <Link href={`/admin/categories/${cat.id}`}>
                          <Button size="sm" variant="outline">
                            تعديل
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card.Root>
      )}
    </div>
  )
}
