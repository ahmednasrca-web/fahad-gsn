export const runtime = 'edge'

import Link from 'next/link'
import Image from 'next/image'
import { getAllWorksAdmin } from '@/lib/db/works'

export const dynamic = 'force-dynamic'

export default async function AdminWorksPage() {
  const works = await getAllWorksAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A1209]">الأعمال</h1>
        <Link href="/admin/works/new"
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2C1810] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <span aria-hidden="true">+</span>
          إضافة عمل
        </Link>
      </div>

      {works.length === 0 ? (
        <div className="rounded-2xl border border-[#E8DDD0] bg-white p-12 text-center">
          <p className="text-4xl" aria-hidden="true">🪵</p>
          <p className="mt-4 text-lg font-medium text-[#3D2B1A]">لا توجد أعمال بعد</p>
          <Link href="/admin/works/new"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-[#2C1810] px-6 text-sm font-semibold text-white"
          >
            أضف أول عمل
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DDD0] bg-[#F5F0E8]">
                <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">الصورة</th>
                <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">العنوان</th>
                <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">الحالة</th>
                <th className="hidden px-4 py-3 text-start font-semibold text-[#1A1209] sm:table-cell">السعر</th>
                <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">تعديل</th>
              </tr>
            </thead>
            <tbody>
              {works.map((work, i) => (
                <tr key={work.id} className={`border-b border-[#E8DDD0] transition-colors hover:bg-[#F5F0E8] ${i === works.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#F0E8D8]">
                      {work.primaryImage ? (
                        <Image src={work.primaryImage} alt={work.titleAr} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl" aria-hidden="true">🪵</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1A1209]">{work.titleAr}</p>
                    <p className="text-xs text-[#6B5C4E]">{work.titleEn}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${work.isPublished ? 'bg-green-100 text-green-700' : 'bg-[#F0E8D8] text-[#6B3F1F]'}`}>
                        {work.isPublished ? 'منشور' : 'مسودة'}
                      </span>
                      {work.isFeatured && (
                        <span className="inline-flex w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">مميز</span>
                      )}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-[#3D2B1A] sm:table-cell">
                    {work.price != null ? `${work.price} د.ك` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/works/${work.id}`}
                      className="rounded-lg border border-[#E8DDD0] px-3 py-1.5 text-xs font-medium text-[#3D2B1A] transition-colors hover:border-[#C4854A] hover:text-[#2C1810]"
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
