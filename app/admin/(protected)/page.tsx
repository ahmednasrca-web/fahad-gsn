import Link from 'next/link'
import { getAllWorksAdmin } from '@/lib/db/works'
import { getAllCategoriesAdmin } from '@/lib/db/categories'
import { getAllMessages } from '@/lib/db/messages'

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
    { label: 'إجمالي الأعمال', value: works.length, sub: `${publishedCount} منشور`, href: '/admin/works' },
    { label: 'التصنيفات', value: categories.length, sub: `${categories.filter(c => c.isActive).length} نشط`, href: '/admin/categories' },
    { label: 'الرسائل', value: messages.length, sub: unreadCount > 0 ? `${unreadCount} غير مقروء` : 'كل الرسائل مقروءة', href: '/admin/messages', alert: unreadCount > 0 },
  ]

  const recentWorks = works.slice(0, 5)

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-[#1A1209]">لوحة التحكم</h1>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className={`rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md ${stat.alert ? 'border-[#C4854A]' : 'border-[#E8DDD0]'}`}
          >
            <p className="text-3xl font-bold text-[#2C1810]">{stat.value}</p>
            <p className="mt-1 font-semibold text-[#1A1209]">{stat.label}</p>
            <p className={`mt-0.5 text-sm ${stat.alert ? 'font-semibold text-[#C4854A]' : 'text-[#6B5C4E]'}`}>{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link href="/admin/works/new"
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#2C1810] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <span aria-hidden="true">+</span>
          إضافة عمل جديد
        </Link>
        <Link href="/admin/categories"
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E8DDD0] bg-white px-5 text-sm font-medium text-[#3D2B1A] transition-colors hover:border-[#C4854A]"
        >
          إدارة التصنيفات
        </Link>
        <Link href="/admin/content"
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E8DDD0] bg-white px-5 text-sm font-medium text-[#3D2B1A] transition-colors hover:border-[#C4854A]"
        >
          تعديل المحتوى
        </Link>
      </div>

      {/* Recent works */}
      {recentWorks.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1A1209]">آخر الأعمال</h2>
            <Link href="/admin/works" className="text-sm text-[#6B3F1F] hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8DDD0] bg-[#F5F0E8]">
                  <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">العمل</th>
                  <th className="px-4 py-3 text-start font-semibold text-[#1A1209]">الحالة</th>
                  <th className="hidden px-4 py-3 text-start font-semibold text-[#1A1209] sm:table-cell">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentWorks.map((work, i) => (
                  <tr key={work.id} className={`border-b border-[#E8DDD0] transition-colors hover:bg-[#F5F0E8] ${i === recentWorks.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/works/${work.id}`} className="font-medium text-[#1A1209] hover:text-[#6B3F1F]">
                        {work.titleAr}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${work.isPublished ? 'bg-green-100 text-green-700' : 'bg-[#F0E8D8] text-[#6B3F1F]'}`}>
                        {work.isPublished ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-[#6B5C4E] sm:table-cell">
                      {new Date(work.createdAt).toLocaleDateString('ar-KW')}
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
