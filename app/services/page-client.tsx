'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { TierCard, SERVICE_TIERS } from '@/components/ui/TierCard'

// Lazy load ServicesGrid for better performance
const ServicesGrid = dynamic(
  () => import('@/components/ui/Services').then((mod) => mod.ServicesGrid),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-void-light" />,
  }
)

export function ServicesPageClient() {
  return (
    <main className="relative min-h-screen bg-void text-white">
      <Header />

      {/* Services Grid Section */}
      <ServicesGrid className="pt-32 pb-16 md:pt-40 md:pb-24" />

      {/* Hero Section */}
      <SectionWrapper className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h1" className="mb-6">
              Choose Your Trajectory
            </Typography>
            <Typography variant="body" className="mx-auto max-w-2xl text-gray-400">
              From rapid MVPs to enterprise ecosystems. Each tier is crafted with precision,
              designed to launch your vision into the digital void.
            </Typography>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Tiers Grid */}
      <SectionWrapper className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SERVICE_TIERS.map((tier, index) => (
              <TierCard key={tier.name} tier={tier} index={index} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="py-24 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Typography variant="h2" className="mb-4 text-balance">
            Ready to launch?
          </Typography>
          <Typography variant="body" className="mb-10 text-gray-400">
            Not sure which trajectory fits? Let&apos;s discuss your vision and find the perfect path forward.
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
