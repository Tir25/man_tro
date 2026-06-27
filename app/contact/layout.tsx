import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Tirth Raval. Tell me about your product vision, upcoming app, or next frontier. I respond within a few hours.',
  openGraph: {
    title: 'Contact - Freelance Studio of Tirth Raval',
    description:
      'Get in touch with Tirth Raval. Tell me about your product vision, upcoming app, or next frontier.',
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

