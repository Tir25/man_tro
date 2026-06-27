import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of digital ventures shaping the modern web. High-performance, beautifully designed web and mobile apps.',
  openGraph: {
    title: 'Projects - Tirth Raval Portfolio',
    description:
      'Explore my portfolio of digital ventures shaping the modern web.',
    type: 'website',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

