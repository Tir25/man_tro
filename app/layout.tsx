import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/effects/SmoothScroll'
import { AppLoader } from '@/components/layout/AppLoader'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { getCriticalCSS } from '@/lib/criticalCSS'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
})
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mantro.agency'
const OG_IMAGE = '/og-image.svg'
const SITE_TITLE = 'Mantro - Premium Digital Creation Agency'
const SITE_DESCRIPTION = 'Ethereal Industrialism. Digital experiences reimagined.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Mantro',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Mantro',
    'digital agency',
    'product design',
    'web experiences',
    'three.js',
    'framer motion',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Mantro',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Mantro hero visual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: '@mantro',
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Critical CSS - inline for faster initial render */}
        <style dangerouslySetInnerHTML={{ __html: getCriticalCSS('/') }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ToastProvider>
          <ServiceWorkerRegistration />
          <AppLoader />
          <SmoothScroll>{children}</SmoothScroll>
        </ToastProvider>
      </body>
    </html>
  )
}
