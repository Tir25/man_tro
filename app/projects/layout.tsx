import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore our portfolio of spatial ventures shaping the next operating systems for reality. Parallax masonry of innovative digital experiences.',
  openGraph: {
    title: 'Projects - Mantro Portfolio',
    description:
      'Explore our portfolio of spatial ventures shaping the next operating systems for reality.',
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

