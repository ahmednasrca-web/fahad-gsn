import Link from 'next/link'
import { getAllReelsAdmin } from '@/lib/db/reels'
import { PROVIDER_META } from '@/lib/reels/providers'
import { Card, Chip, Button } from '@heroui/react'

export const dynamic = 'force-dynamic'

export default async function AdminReelsPage() {
  const reels = await getAllReelsAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1209]">مقاطع الريلز (Social Videos)</h1>
          <p className="mt-1 text-sm text-[#6B5C4E]">
            إدارة فيديوهات الريلز المعروضة في المعرض من Instagram, YouTube, TikTok, Facebook
          </p>
        </div>
        <Link href="/admin/reels/new">
          <Button variant="primary">
            <span aria-hidden="true">+</span>
            إضافة ريلز جديد
          </Button>
        </Link>
      </div>

      {reels.length === 0 ? (
        <Card.Root className="border border-[#E8DDD0] bg-white p-12 text-center shadow-xs">
          <Card.Content>
            <p className="text-5xl" aria-hidden="true">🎬</p>
            <p className="mt-4 text-xl font-bold text-[#2C1810]">لا توجد مقاطع ريلز بعد</p>
            <p className="mt-1 text-sm text-[#8A7968]">
              أضف أول فيديو لعرض كواليس الحرفة والتشكيل اليدوي للأعمال للزوار
            </p>
            <div className="mt-6">
              <Link href="/admin/reels/new">
                <Button variant="primary">
                  + أضف أول ريلز
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
                    <th className="px-6 py-4 text-start">المنصة</th>
                    <th className="px-6 py-4 text-start">العنوان / المعرف</th>
                    <th className="px-6 py-4 text-start">الحالة</th>
                    <th className="hidden px-6 py-4 text-start sm:table-cell">الترتيب</th>
                    <th className="hidden px-6 py-4 text-start md:table-cell">الرابط الأصلي</th>
                    <th className="px-6 py-4 text-end">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]">
                  {reels.map((reel) => {
                    const meta = PROVIDER_META[reel.provider]
                    return (
                      <tr key={reel.id} className="transition-colors hover:bg-[#FAF7F2]/60">
                        {/* Platform Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                              meta ? meta.badgeBg + ' ' + meta.badgeText : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            <span aria-hidden="true">{meta?.icon ?? '🎬'}</span>
                            {meta?.nameAr ?? reel.provider}
                          </span>
                        </td>

                        {/* Title / Content ID */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#1A1209]">
                            {reel.titleAr || reel.titleEn || (
                              <span className="font-mono text-xs text-[#8A7968]">ID: {reel.contentId}</span>
                            )}
                          </p>
                          {reel.titleEn && reel.titleAr && (
                            <p className="text-xs text-[#8A7968] font-mono">{reel.titleEn}</p>
                          )}
                        </td>

                        {/* Status Chips */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Chip.Root
                              color={reel.isPublished ? 'success' : 'default'}
                              size="sm"
                              variant="soft"
                            >
                              <Chip.Label>{reel.isPublished ? 'منشور' : 'مسودة'}</Chip.Label>
                            </Chip.Root>
                            {reel.isFeatured && (
                              <Chip.Root color="warning" size="sm" variant="soft">
                                <Chip.Label>⭐ مميز</Chip.Label>
                              </Chip.Root>
                            )}
                          </div>
                        </td>

                        {/* Order */}
                        <td className="hidden px-6 py-4 text-[#3D2B1A] sm:table-cell font-mono">
                          {reel.sortOrder}
                        </td>

                        {/* Original URL link */}
                        <td className="hidden px-6 py-4 md:table-cell max-w-[200px] truncate">
                          <a
                            href={reel.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C4854A] hover:underline font-mono truncate block"
                            dir="ltr"
                          >
                            {reel.originalUrl}
                          </a>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-end">
                          <Link href={`/admin/reels/${reel.id}`}>
                            <Button size="sm" variant="outline">
                              تعديل
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card.Root>
      )}
    </div>
  )
}
