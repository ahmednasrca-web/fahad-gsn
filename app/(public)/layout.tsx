import { SiteHeader, SiteFooter } from '@/components/layout'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden">
      <SiteHeader />
      <main className="relative z-10 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
