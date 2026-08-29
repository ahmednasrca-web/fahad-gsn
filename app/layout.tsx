import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import { safeJsonLd } from '@/lib/json-ld'
import './globals.css'

const thmanyahSans = localFont({
  src: [
    { path: '../public/fonts/thmanyah-sans/thmanyahsans-Light.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/thmanyah-sans/thmanyahsans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/thmanyah-sans/thmanyahsans-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/thmanyah-sans/thmanyahsans-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/thmanyah-sans/thmanyahsans-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-thmanyah-sans',
  display: 'swap',
})

const thmanyahDisplay = localFont({
  src: [
    { path: '../public/fonts/thmanyah-serif-display/thmanyahserifdisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/thmanyah-serif-display/thmanyahserifdisplay-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/thmanyah-serif-display/thmanyahserifdisplay-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/thmanyah-serif-display/thmanyahserifdisplay-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-thmanyah-display',
  display: 'swap',
})

const thmanyahSerif = localFont({
  src: [
    { path: '../public/fonts/thmanyah-serif-text/thmanyahseriftext-Light.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/thmanyah-serif-text/thmanyahseriftext-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/thmanyah-serif-text/thmanyahseriftext-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/thmanyah-serif-text/thmanyahseriftext-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-thmanyah-serif',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
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
      className={`${thmanyahSans.variable} ${thmanyahDisplay.variable} ${thmanyahSerif.variable} ${playfair.variable}`}
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
