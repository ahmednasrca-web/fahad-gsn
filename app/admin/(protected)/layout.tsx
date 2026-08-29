import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifySession, SESSION_COOKIE } from '@/lib/session'

export const metadata = {
  title: 'لوحة التحكم | فهد غصن',
  robots: { index: false, follow: false },
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-svh bg-[#FAF7F2]">
      {children}
    </div>
  )
}
