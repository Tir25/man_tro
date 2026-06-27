import type { Metadata } from 'next'
import { ServicesPageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Freelance Services',
  description:
    'Freelance web development, frontend engineering, app development, and design services by Tirth Raval.',
  openGraph: {
    title: 'Freelance Services | Mantro',
    description:
      'Freelance web development, frontend engineering, app development, and design services by Tirth Raval.',
    type: 'website',
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}

