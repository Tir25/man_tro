'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Lazy load ServicesGrid for better performance
const ServicesGrid = dynamic(
  () => import('@/components/ui/Services').then((mod) => mod.ServicesGrid),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-void-light" />,
  }
)

interface Tier {
  name: string
  subtitle: string
  price: string
  includes: string[]
  gradient: string
}

const tiers: Tier[] = [
  {
    name: 'The Ignition',
    subtitle: 'MVP / Prototype',
    price: '₹4K - ₹8K',
    includes: [
      'Clean, responsive site or simple web app (up to 3 pages/screens)',
      'Basic design system with minimal transitions',
      'Essential functionality: contact forms, static content, light integrations',
      '1-2 revision rounds with deployment assistance',
      '1 month maintenance/support with simple SEO setup',
      'Delivery window: 2-3 weeks, entry-level pricing',
    ],
    gradient: 'from-cyan/20 via-cyan/10 to-transparent',
  },
  {
    name: 'The Orbit',
    subtitle: 'Full Brand / Product',
    price: '₹12K - ₹25K',
    includes: [
      'Full website or app (up to 10 pages/screens)',
      'Interactive animations, scroll effects, micro-interactions',
      'API/database integrations plus optional AI/chatbot layer',
      '3-5 revision rounds with extended deployment support',
      '3-6 months maintenance, SEO & performance optimization',
      'Delivery window: 4-6 weeks, best-value pricing',
    ],
    gradient: 'from-cyber-violet/20 via-cyber-violet/10 to-transparent',
  },
  {
    name: 'The Galaxy',
    subtitle: 'Enterprise Ecosystem',
    price: 'Custom / Retainer (₹)',
    includes: [
      'Fully bespoke design/dev across web, app, or AI agent surfaces',
      'Advanced motion graphics, interactions, and custom shaders',
      'Unlimited pages/screens with custom revision agreements',
      'Full deployment, monitoring, and SLA-backed 6-12 month support',
      'Deep AI integrations, analytics, security hardening, complex features',
      'Delivery timeline set per scope, premium bespoke pricing',
    ],
    gradient: 'from-cyan/20 via-cyber-violet/20 to-cyan/10',
  },
]

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative h-full"
    >
      {/* Glass Artifact Card */}
      <div
        className={cn(
          'relative h-full rounded-[2rem] border border-glass-border',
          'bg-gradient-to-br from-white/5 to-white/[0.02]',
          'backdrop-blur-xl',
          'p-8 md:p-10',
          'transition-all duration-500',
          'before:absolute before:inset-0 before:rounded-[2rem]',
          'before:bg-gradient-to-br',
          `before:${tier.gradient}`,
          'before:opacity-0 before:transition-opacity before:duration-500',
          'group-hover:before:opacity-100',
          'group-hover:border-cyan/30',
          'group-hover:shadow-[0_0_40px_rgba(76,201,240,0.15)]',
          'overflow-hidden'
        )}
      >
        {/* Glowing edge effect on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-[2rem]',
            'bg-gradient-to-r from-cyan/0 via-cyan/20 to-cyan/0',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            'blur-xl -z-10'
          )}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Header */}
          <div className="mb-6">
            <Typography variant="h3" className="mb-2">
              {tier.name}
            </Typography>
            <Typography variant="body" className="text-gray-400 mb-4">
              {tier.subtitle}
            </Typography>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan/10 px-4 py-2 border border-cyan/20">
              <Typography variant="h4" color="cyan" className="text-2xl">
                {tier.price}
              </Typography>
            </div>
          </div>

          {/* Includes List */}
          <div className="flex-1 space-y-3">
            <Typography variant="small" className="text-gray-500 uppercase tracking-wider mb-4">
              Includes
            </Typography>
            {tier.includes.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-cyan opacity-60 group-hover:opacity-100 transition-opacity" />
                <Typography variant="body" className="text-white/80 group-hover:text-white transition-colors">
                  {item}
                </Typography>
              </motion.div>
            ))}
          </div>

          {/* CTA removed per request */}
        </div>
      </div>
    </motion.div>
  )
}

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
            {tiers.map((tier, index) => (
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

