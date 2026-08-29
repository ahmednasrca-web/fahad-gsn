import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Noto_Naskh_Arabic } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
})

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-naskh',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'فهد غصن | Fahad Gsn',
    template: '%s | فهد غصن',
  },
  description: 'أعمال خشبية يدوية فاخرة — Luxury Handcrafted Wood | Kuwait',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahadgsn.com'),
  openGraph: {
    siteName: 'فهد غصن | Fahad Gsn',
    locale: 'ar_KW',
    alternateLocale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#2C1810',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${playfair.variable} ${notoNaskh.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
