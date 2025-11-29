import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Mantro - A studio for immersive digital experiences where WebGL, motion, and engineering converge into something quietly luminous.',
  openGraph: {
    title: 'About Mantro - Premium Digital Creation Agency',
    description:
      'Learn about Mantro - A studio for immersive digital experiences where WebGL, motion, and engineering converge.',
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

