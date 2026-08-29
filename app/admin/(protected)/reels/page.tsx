import Link from 'next/link'
import { getAllReelsAdmin } from '@/lib/db/reels'
import { PROVIDER_META } from '@/lib/reels/providers'

export const dynamic = 'force-dynamic'

export default async function AdminReelsPage() {
  const reels = await getAllReelsAdmin()

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1209]">مقاطع الريلز (Social Videos)</h1>
          <p className="mt-1 text-sm text-[#6B5C4E]">
            إدارة فيديوهات الريلز المعروضة في المعرض من Instagram, YouTube, TikTok, Facebook.
          </p>
        </div>
        <Link
          href="/admin/reels/new"
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2C1810] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
        >
          <span aria-hidden="true">+</span>
          إضافة ريلز جديد
        </Link>
      </div>

      {reels.length === 0 ? (
        <div className="rounded-2xl border border-[#E8DDD0] bg-white p-12 text-center">
          <p className="text-4xl" aria-hidden="true">🎬</p>
          <p className="mt-4 text-lg font-medium text-[#3D2B1A]">لا توجد مقاطع ريلز بعد</p>
          <p className="mt-1 text-sm text-[#8A7968]">
            أضف أول فيديو لعرض كواليس الحرفة والتشكيل اليدوي للزوار.
          </p>
          <Link
            href="/admin/reels/new"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-[#2C1810] px-6 text-sm font-semibold text-white shadow-sm"
          >
            أضف أول ريلز
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DDD0] bg-[#F5F0E8]">
                <th className="px-4 py-3.5 text-start font-semibold text-[#1A1209]">المنصة</th>
                <th className="px-4 py-3.5 text-start font-semibold text-[#1A1209]">العنوان / المعرف</th>
                <th className="px-4 py-3.5 text-start font-semibold text-[#1A1209]">الحالة</th>
                <th className="hidden px-4 py-3.5 text-start font-semibold text-[#1A1209] sm:table-cell">الترتيب</th>
                <th className="hidden px-4 py-3.5 text-start font-semibold text-[#1A1209] md:table-cell">الرابط الأصلي</th>
                <th className="px-4 py-3.5 text-start font-semibold text-[#1A1209]">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {reels.map((reel, i) => {
                const meta = PROVIDER_META[reel.provider]
                return (
                  <tr
                    key={reel.id}
                    className={`border-b border-[#E8DDD0] transition-colors hover:bg-[#F5F0E8]/60 ${
                      i === reels.length - 1 ? 'border-0' : ''
                    }`}
                  >
                    {/* Platform Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          meta ? meta.badgeBg + ' ' + meta.badgeText : 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <span aria-hidden="true">{meta?.icon ?? '🎬'}</span>
                        {meta?.nameAr ?? reel.provider}
                      </span>
                    </td>

                    {/* Title / Content ID */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#1A1209]">
                        {reel.titleAr || reel.titleEn || <span className="font-mono text-xs text-[#8A7968]">{reel.contentId}</span>}
                      </p>
                      {reel.titleEn && reel.titleAr && (
                        <p className="text-xs text-[#6B5C4E]">{reel.titleEn}</p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            reel.isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-[#F0E8D8] text-[#6B3F1F]'
                          }`}
                        >
                          {reel.isPublished ? 'منشور' : 'مسودة'}
                        </span>
                        {reel.isFeatured && (
                          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                            ⭐ مميز
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Order */}
                    <td className="hidden px-4 py-3.5 text-[#3D2B1A] sm:table-cell font-mono">
                      {reel.sortOrder}
                    </td>

                    {/* Original URL link */}
                    <td className="hidden px-4 py-3.5 md:table-cell max-w-[200px] truncate">
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
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/reels/${reel.id}`}
                        className="inline-flex items-center rounded-lg border border-[#E8DDD0] bg-white px-3 py-1.5 text-xs font-medium text-[#3D2B1A] transition-colors hover:border-[#C4854A] hover:text-[#2C1810] shadow-2xs"
                      >
                        تعديل
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
