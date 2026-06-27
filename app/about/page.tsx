import { Metadata } from 'next'
import { AboutPageClient } from './page-client'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn more about Tirth Raval, a freelance Full-Stack Web Developer, Frontend Engineer, and App Developer.',
  openGraph: {
    title: 'About - Tirth Raval',
    description:
      'Learn more about Tirth Raval, a freelance Full-Stack Web Developer, Frontend Engineer, and App Developer.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
