import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Noto_Naskh_Arabic } from 'next/font/google'
import { safeJsonLd } from '@/lib/json-ld'
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo-icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#2C1810',
  width: 'device-width',
  initialScale: 1,
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'فهد غصن | Fahad Gsn',
  image: 'https://fahadgsn.com/logo-full.png',
  description: 'أعمال خشبية يدوية فاخرة وأثاث مخصص بالكويت',
  url: 'https://fahadgsn.com',
  telephone: '+96598908022',
  priceRange: '$$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KW',
    addressLocality: 'Kuwait City',
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
