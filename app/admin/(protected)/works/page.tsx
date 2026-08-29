import Link from 'next/link'
import Image from 'next/image'
import { getAllWorksAdmin } from '@/lib/db/works'
import { Card, Chip, Button } from '@heroui/react'

export const dynamic = 'force-dynamic'

export default async function AdminWorksPage() {
  const works = await getAllWorksAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1209]">معرض الأعمال</h1>
          <p className="text-sm text-[#6B5C4E]">إدارة وتعديل القطع الخشبية المعروضة في المتجر</p>
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
        <Card.Root className="border border-[#E8DDD0] bg-white overflow-hidden shadow-xs">
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2] text-xs font-semibold text-[#8A7968]">
                    <th className="px-6 py-4 text-start">القطعة</th>
                    <th className="px-6 py-4 text-start">العنوان</th>
                    <th className="px-6 py-4 text-start">الحالة</th>
                    <th className="hidden px-6 py-4 text-start sm:table-cell">السعر</th>
                    <th className="px-6 py-4 text-end">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]">
                  {works.map((work) => (
                    <tr key={work.id} className="transition-colors hover:bg-[#FAF7F2]/60">
                      {/* Image Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#F0E8D8] border border-[#E8DDD0] shadow-2xs">
                          {work.primaryImage ? (
                            <Image
                              src={work.primaryImage}
                              alt={work.titleAr}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-2xl" aria-hidden="true">
                              🪵
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Titles */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/works/${work.id}`}
                          className="font-bold text-[#1A1209] hover:text-[#C4854A] transition-colors"
                        >
                          {work.titleAr}
                        </Link>
                        <p className="text-xs text-[#8A7968] font-mono">{work.titleEn}</p>
                      </td>

                      {/* Status Chips */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Chip.Root
                            color={work.isPublished ? 'success' : 'default'}
                            size="sm"
                            variant="soft"
                          >
                            <Chip.Label>{work.isPublished ? 'منشور' : 'مسودة'}</Chip.Label>
                          </Chip.Root>
                          {work.isFeatured && (
                            <Chip.Root color="warning" size="sm" variant="soft">
                              <Chip.Label>⭐ مميز</Chip.Label>
                            </Chip.Root>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="hidden px-6 py-4 sm:table-cell">
                        {work.price != null ? (
                          <span className="font-semibold text-[#2C1810]">
                            {work.price.toLocaleString('ar-KW')} <span className="text-xs text-[#8A7968]">د.ك</span>
                          </span>
                        ) : (
                          <span className="text-xs text-[#A09080]">حسب الطلب</span>
                        )}
                      </td>

                      {/* Edit Button */}
                      <td className="px-6 py-4 text-end">
                        <Link href={`/admin/works/${work.id}`}>
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
