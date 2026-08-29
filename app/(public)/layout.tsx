import { getLocale } from '@/lib/locale'
import { getDir } from '@/lib/i18n'
import { SiteHeader, SiteFooter } from '@/components/layout'


export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dir = getDir(locale)

  return (
    <div dir={dir} lang={locale} className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
