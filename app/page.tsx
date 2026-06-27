import type { Metadata } from 'next'
import { HomePageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Mantro | Tirth Raval',
  description:
    'Mantro is the freelance studio of Tirth Raval, a Full-Stack Web Developer, Frontend Engineer, and Web Designer building high-performance digital experiences.',
  openGraph: {
    title: 'Mantro - Freelance Studio of Tirth Raval',
    description:
      'I am Tirth Raval, a freelance Full-Stack Web Developer building high-performance web and mobile applications.',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Mantro - Freelance Studio of Tirth Raval',
      },
    ],
  },
}

export default function HomePage() {
  return <HomePageClient />
}

