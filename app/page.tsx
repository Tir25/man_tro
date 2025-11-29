import type { Metadata } from 'next'
import { HomePageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Mantro - Premium Digital Creation Agency. Ethereal Industrialism. We build digital experiences that transcend the ordinary and define the future.',
  openGraph: {
    title: 'Mantro - Premium Digital Creation Agency',
    description:
      'Ethereal Industrialism. We build digital experiences that transcend the ordinary and define the future.',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Mantro - Premium Digital Creation Agency',
      },
    ],
  },
}

export default function HomePage() {
  return <HomePageClient />
}

