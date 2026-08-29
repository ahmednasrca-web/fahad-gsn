import Link from 'next/link'
import { getAllReelsAdmin } from '@/lib/db/reels'
import { Card, Button } from '@heroui/react'
import ReelsListClient from '@/components/admin/ReelsListClient'

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
            إدارة وترتيب فيديوهات الريلز المعروضة في المعرض من Instagram, YouTube, TikTok, Facebook
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
        <ReelsListClient initialReels={reels} />
      )}
    </div>
  )
}
