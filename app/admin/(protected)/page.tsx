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
    {
      label: 'إجمالي الأعمال',
      value: works.length,
      sub: `${publishedCount} منشور في الموقع`,
      href: '/admin/works',
      icon: '🪵',
      chipText: `${publishedCount} منشور`,
    },
    {
      label: 'التصنيفات',
      value: categories.length,
      sub: `${categories.filter((c) => c.isActive).length} تصنيف نشط`,
      href: '/admin/categories',
      icon: '🏷️',
      chipText: `${categories.filter((c) => c.isActive).length} نشط`,
    },
    {
      label: 'الرسائل الواردة',
      value: messages.length,
      sub: unreadCount > 0 ? `${unreadCount} رسالة غير مقروءة` : 'تمت قراءة جميع الرسائل',
      href: '/admin/messages',
      icon: '💬',
      chipText: unreadCount > 0 ? `${unreadCount} جديدة` : 'محدثة',
      alert: unreadCount > 0,
    },
  ]

  const recentWorks = works.slice(0, 5)

  return (
    <div className="mt-14 pt-6 md:mt-0" dir="rtl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#ecebe9] dark:border-[#211f1c]">
        <div>
          <span className="furnish-subheading">إدارة المتجر والمشغل</span>
          <h1 className="text-3xl font-normal tracking-tight text-[#11100e] dark:text-[#f6f5f4] mt-1 font-display">لوحة التحكم</h1>
          <p className="text-xs sm:text-sm text-[#837a6d] mt-1">مرحباً بك، إليك ملخص نشاط متجر وأعمال فهد غصن</p>
        </div>
        <Link href="/admin/works/new" className="admin-btn-primary self-start sm:self-auto">
          <span aria-hidden="true" className="text-base">+</span>
          إضافة عمل جديد
        </Link>
      </div>

      {/* Stats Cards — Furnish Architectural Cards */}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group block focus:outline-none">
            <div
              className={`furnish-card h-full p-6 transition-all duration-300 hover:-translate-y-1 ${
                stat.alert ? 'border-[#d47f31]' : ''
              }`}
            >
              <div className="flex flex-col justify-between h-full gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
                  <span className="furnish-badge">
                    {stat.chipText}
                  </span>
                </div>
                <div>
                  <p className="text-4xl font-normal font-mono tracking-tight text-[#11100e] dark:text-[#f6f5f4]">{stat.value}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wider text-[#11100e] dark:text-[#f6f5f4] group-hover:text-[#d47f31] transition-colors">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#837a6d]">{stat.sub}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="mb-10 furnish-card p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#837a6d]">إجراءات سريعة</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/works/new" className="admin-btn-primary text-xs py-2 px-4 min-h-[38px]">
            + إضافة عمل
          </Link>
          <Link href="/admin/reels/new" className="btn-furnish-outline text-xs py-2 px-4 min-h-[38px]">
            🎬 إضافة مقطع ريلز
          </Link>
          <Link href="/admin/categories/new" className="btn-furnish-outline text-xs py-2 px-4 min-h-[38px]">
            🏷️ تصنيف جديد
          </Link>
          <Link href="/admin/content" className="btn-furnish-outline text-xs py-2 px-4 min-h-[38px]">
            ✍️ تعديل نصوص الموقع
          </Link>
          <Link href="/admin/messages" className="btn-furnish-outline text-xs py-2 px-4 min-h-[38px]">
            📬 معاينة الرسائل ({unreadCount})
          </Link>
        </div>
      </div>

      {/* Recent Works Modern Table */}
      {recentWorks.length > 0 && (
        <div className="furnish-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#ecebe9] dark:border-[#211f1c] bg-[#f6f5f4] dark:bg-[#11100e] px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#11100e] dark:text-[#f6f5f4]">آخر الأعمال المضافة</h2>
            <Link href="/admin/works" className="text-xs font-semibold text-[#d47f31] hover:underline">
              عرض كافة الأعمال ←
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#ecebe9] dark:border-[#211f1c] text-xs font-semibold uppercase tracking-wider text-[#837a6d]">
                  <th className="px-6 py-3.5 text-start">العمل</th>
                  <th className="px-6 py-3.5 text-start">الحالة</th>
                  <th className="hidden px-6 py-3.5 text-start sm:table-cell">التاريخ</th>
                  <th className="px-6 py-3.5 text-end">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecebe9] dark:divide-[#211f1c]">
                {recentWorks.map((work) => (
                  <tr key={work.id} className="transition-colors hover:bg-[#f6f5f4]/80 dark:hover:bg-[#11100e]/80">
                    <td className="px-6 py-4">
                      <Link href={`/admin/works/${work.id}`} className="font-semibold text-[#11100e] dark:text-[#f6f5f4] hover:text-[#d47f31]">
                        {work.titleAr}
                      </Link>
                      <p className="text-xs text-[#837a6d]">{work.titleEn}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="furnish-badge">
                        {work.isPublished ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-xs text-[#837a6d] sm:table-cell">
                      {new Date(work.createdAt).toLocaleDateString('ar-KW')}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Link href={`/admin/works/${work.id}`} className="btn-furnish-outline text-xs px-3 py-1.5 min-h-[32px] inline-flex">
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
