import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { safeJsonLd } from '@/lib/json-ld'
import { getLocale } from '@/lib/locale'
import { getDir } from '@/lib/i18n'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
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

export const metadata: Metadata = {
  title: {
    default: 'فهد غصن | Fahad Gsn',
    template: '%s | فهد غصن',
  },
  description: 'أعمال خشبية يدوية فاخرة وأثاث مخصص بالكويت — Luxury Handcrafted Wood & Sculptures | Kuwait',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fahad-gsn.ahmednasr-ca.workers.dev'),
  openGraph: {
    siteName: 'فهد غصن | Fahad Gsn',
    title: 'فهد غصن | Fahad Gsn — Luxury Handcrafted Wood',
    description: 'أعمال خشبية يدوية فاخرة وأثاث مخصص بالكويت — Luxury Handcrafted Wood & Sculptures',
    url: 'https://fahadgsn.com',
    locale: 'ar_KW',
    alternateLocale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo-full.png',
        width: 1200,
        height: 630,
        alt: 'فهد غصن للأعمال الخشبية الفاخرة | Fahad Gsn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فهد غصن | Fahad Gsn',
    description: 'أعمال خشبية يدوية فاخرة — Luxury Handcrafted Wood | Kuwait',
    images: ['/logo-full.png'],
  },
  verification: {
    google: 'GSY5xyl-NKhrA6zzNbDCSPmL9UHn0TkvjIHjFpxBVf0',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dir = getDir(locale)

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${thmanyahSans.variable} ${thmanyahDisplay.variable} ${thmanyahSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fahad_gsn_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
