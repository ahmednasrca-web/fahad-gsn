import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'
import AdminNav from '@/components/admin/AdminNav'

export const metadata = {
  title: { default: 'لوحة التحكم | فهد غصن', template: '%s | لوحة التحكم' },
  robots: { index: false, follow: false },
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-svh bg-[#FAF7F2]">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
