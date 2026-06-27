import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Tirth Raval — a freelance Full-Stack Web Developer, Frontend Engineer, and App Developer building immersive digital experiences.',
  openGraph: {
    title: 'About - Tirth Raval',
    description:
      'Learn about Tirth Raval — a freelance developer where modern web technologies, motion, and engineering converge.',
    type: 'website',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

