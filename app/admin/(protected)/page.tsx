import Link from 'next/link'
import { getAllWorksAdmin } from '@/lib/db/works'
import { getAllCategoriesAdmin } from '@/lib/db/categories'
import { getAllMessages } from '@/lib/db/messages'
import { Card, Chip, Button } from '@heroui/react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [works, categories, messages] = await Promise.all([
    getAllWorksAdmin(),
    getAllCategoriesAdmin(),
    getAllMessages(),
  ])

  const publishedCount = works.filter((w) => w.isPublished).length
  const unreadCount = messages.filter((m) => !m.isRead).length

  const stats = [
    {
      label: 'إجمالي الأعمال',
      value: works.length,
      sub: `${publishedCount} منشور في الموقع`,
      href: '/admin/works',
      icon: '🪵',
      chipColor: 'accent' as const,
      chipText: `${publishedCount} منشور`,
    },
    {
      label: 'التصنيفات',
      value: categories.length,
      sub: `${categories.filter((c) => c.isActive).length} تصنيف نشط`,
      href: '/admin/categories',
      icon: '🏷️',
      chipColor: 'accent' as const,
      chipText: `${categories.filter((c) => c.isActive).length} نشط`,
    },
    {
      label: 'الرسائل الواردة',
      value: messages.length,
      sub: unreadCount > 0 ? `${unreadCount} رسالة غير مقروءة` : 'تمت قراءة جميع الرسائل',
      href: '/admin/messages',
      icon: '💬',
      chipColor: unreadCount > 0 ? ('warning' as const) : ('success' as const),
      chipText: unreadCount > 0 ? `${unreadCount} جديدة` : 'محدثة',
      alert: unreadCount > 0,
    },
  ]

  const recentWorks = works.slice(0, 5)

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1209]">لوحة التحكم</h1>
          <p className="text-sm text-[#6B5C4E]">مرحباً بك، إليك ملخص نشاط متجر وأعمال فهد غصن</p>
        </div>
        <Link href="/admin/works/new">
          <Button variant="primary" className="shadow-sm">
            <span aria-hidden="true" className="text-base">+</span>
            إضافة عمل جديد
          </Button>
        </Link>
      </div>

      {/* Stats Cards — HeroUI Card */}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group block focus:outline-none">
            <Card.Root
              className={`h-full border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                stat.alert ? 'border-[#C4854A] shadow-xs' : 'border-[#E8DDD0]'
              }`}
            >
              <Card.Content className="flex flex-col justify-between h-full gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden="true">{stat.icon}</span>
                  <Chip.Root color={stat.chipColor} size="sm" variant="soft">
                    <Chip.Label>{stat.chipText}</Chip.Label>
                  </Chip.Root>
                </div>
                <div>
                  <p className="text-4xl font-extrabold tracking-tight text-[#2C1810]">{stat.value}</p>
                  <p className="mt-1 text-base font-semibold text-[#1A1209] group-hover:text-[#C4854A] transition-colors">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8A7968]">{stat.sub}</p>
                </div>
              </Card.Content>
            </Card.Root>
          </Link>
        ))}
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="mb-10 rounded-2xl border border-[#E8DDD0] bg-[#FAF7F2] p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#8A7968]">إجراءات سريعة</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/works/new">
            <Button variant="primary" size="sm">
              + إضافة عمل
            </Button>
          </Link>
          <Link href="/admin/reels/new">
            <Button variant="secondary" size="sm">
              🎬 إضافة مقطع ريلز
            </Button>
          </Link>
          <Link href="/admin/categories/new">
            <Button variant="outline" size="sm">
              🏷️ تصنيف جديد
            </Button>
          </Link>
          <Link href="/admin/content">
            <Button variant="outline" size="sm">
              ✍️ تعديل نصوص الموقع
            </Button>
          </Link>
          <Link href="/admin/messages">
            <Button variant="outline" size="sm">
              📬 معاينة الرسائل ({unreadCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Works Modern Table */}
      {recentWorks.length > 0 && (
        <Card.Root className="border border-[#E8DDD0] bg-white overflow-hidden shadow-xs">
          <Card.Content className="p-0">
            <div className="flex items-center justify-between border-b border-[#E8DDD0] bg-[#FAF7F2] px-6 py-4">
              <h2 className="text-base font-bold text-[#1A1209]">آخر الأعمال المضافة</h2>
              <Link href="/admin/works" className="text-xs font-semibold text-[#C4854A] hover:underline">
                عرض كافة الأعمال ←
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8DDD0] text-xs font-medium text-[#8A7968]">
                    <th className="px-6 py-3.5 text-start font-semibold">العمل</th>
                    <th className="px-6 py-3.5 text-start font-semibold">الحالة</th>
                    <th className="hidden px-6 py-3.5 text-start font-semibold sm:table-cell">التاريخ</th>
                    <th className="px-6 py-3.5 text-end font-semibold">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]">
                  {recentWorks.map((work) => (
                    <tr key={work.id} className="transition-colors hover:bg-[#FAF7F2]/80">
                      <td className="px-6 py-4">
                        <Link href={`/admin/works/${work.id}`} className="font-semibold text-[#1A1209] hover:text-[#C4854A]">
                          {work.titleAr}
                        </Link>
                        <p className="text-xs text-[#8A7968]">{work.titleEn}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Chip.Root
                          color={work.isPublished ? 'success' : 'default'}
                          size="sm"
                          variant="soft"
                        >
                          <Chip.Label>{work.isPublished ? 'منشور' : 'مسودة'}</Chip.Label>
                        </Chip.Root>
                      </td>
                      <td className="hidden px-6 py-4 text-xs text-[#6B5C4E] sm:table-cell">
                        {new Date(work.createdAt).toLocaleDateString('ar-KW')}
                      </td>
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

