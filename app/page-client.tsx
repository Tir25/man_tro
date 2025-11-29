 'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Link from 'next/link'

// Lazy load all 3D components with SSR disabled
const MaskMagicHero = dynamic(
  () => import('@/components/effects/MaskMagicHero').then((mod) => mod.MaskMagicHero),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#030304] -z-10" />,
  }
)

// Lazy load heavy components for better initial load performance
const Manifesto = dynamic(
  () => import('@/components/ui/Manifesto').then((mod) => mod.Manifesto),
  {
    ssr: true,
    loading: () => <div className="h-64 bg-void-light" />,
  }
)

const TechStackEngine = dynamic(
  () => import('@/components/features/TechStackEngine').then((mod) => mod.TechStackEngine),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-void-light" />,
  }
)

export function HomePageClient() {
  return (
    <main className="relative min-h-screen bg-void text-white">
      <Header />
      <ErrorBoundary
        fallback={
          <div className="h-screen flex items-center justify-center">
            <p className="text-white/60">Hero section unavailable</p>
          </div>
        }
      >
        <Suspense fallback={<div className="fixed inset-0 bg-[#030304] -z-10" />}>
          <MaskMagicHero />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Manifesto className="-mt-32 md:-mt-40 lg:-mt-48 z-[5]" />
      </ErrorBoundary>
      <ErrorBoundary>
        <TechStackEngine className="-mt-16 md:-mt-24 lg:-mt-32 rounded-t-[2.5rem] bg-void-light z-10" />
      </ErrorBoundary>
      <SectionWrapper
        id="contact"
        className="-mt-10 bg-gradient-to-b from-void-light to-void-deep py-24 md:py-32 relative z-30"
      >
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Typography variant="h2" className="mb-4 text-balance">
            Let&apos;s build something impossible
          </Typography>
          <Typography variant="body" className="mb-10 text-gray-400">
            Tell us about your product vision, upcoming campaign, or next frontier. We respond within two business days
            with a tailored, technically-grounded path forward.
          </Typography>
          <Button size="lg" className="min-w-[220px]" asChild>
            <Link href="/contact">Start a Project</Link>
          </Button>
        </div>
      </SectionWrapper>
      <Footer />
    </main>
  )
}

