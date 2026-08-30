import { getLocale } from '@/lib/locale'
import { getDir } from '@/lib/i18n'
import { SiteHeader, SiteFooter } from '@/components/layout'
import AtelierAmbienceAudio from '@/components/interactive/AtelierAmbienceAudio'
import AmbientIncenseMist from '@/components/ambient/AmbientIncenseMist'
import AtelierHapticAudioProvider from '@/components/interactive/AtelierHapticAudio'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dir = getDir(locale)

  return (
    <AtelierHapticAudioProvider>
      <div dir={dir} lang={locale} className="relative flex min-h-svh flex-col overflow-x-hidden">
        {/* Background Ambient Incense Mist */}
        <AmbientIncenseMist />
        <SiteHeader />
        <main className="relative z-10 flex-1">
          {children}
        </main>
        <SiteFooter />
        <AtelierAmbienceAudio locale={locale} />
      </div>
    </AtelierHapticAudioProvider>
  )
}
