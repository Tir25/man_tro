import type { Metadata } from 'next'
import { ServicesPageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Choose Your Trajectory. From rapid MVPs to enterprise ecosystems, we craft digital experiences that transcend the ordinary.',
  openGraph: {
    title: 'Services | Mantro',
    description:
      'Choose Your Trajectory. From rapid MVPs to enterprise ecosystems, we craft digital experiences that transcend the ordinary.',
    type: 'website',
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}

