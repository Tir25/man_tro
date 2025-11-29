import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Mantro. Tell us about your product vision, upcoming campaign, or next frontier. We respond within 24 hours.',
  openGraph: {
    title: 'Contact Mantro - Premium Digital Creation Agency',
    description:
      'Get in touch with Mantro. Tell us about your product vision, upcoming campaign, or next frontier.',
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

