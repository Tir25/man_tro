'use client'

import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { GlassContactForm } from '@/components/contact/GlassContactForm'
import { HulyLaserBackground } from '@/components/contact/HulyLaserBackground'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { motion } from 'framer-motion'

// Note: Metadata is handled in app/contact/layout.tsx

const leftColumnVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
}

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'tirthraval27@gmail.com'

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030304] text-white">
      <ErrorBoundary
        fallback={
          <div className="absolute inset-0 bg-void flex items-center justify-center">
            <p className="text-white/60">Background effect unavailable</p>
          </div>
        }
      >
        <HulyLaserBackground />
      </ErrorBoundary>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <section className="flex flex-1 items-stretch px-4 pb-16 pt-28 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)] md:gap-16">
            {/* Left: Invite */}
            <motion.div
              variants={leftColumnVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col justify-between space-y-10 md:space-y-12"
            >
              <div className="space-y-6">
                <p className="text-xs font-medium uppercase tracking-[0.32em] text-white/45">
                  Contact
                </p>
                <h1 className="font-semibold tracking-tight text-4xl sm:text-5xl lg:text-6xl">
                  Let&apos;s Build the Future.
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                  Tell us about your vision, product, or frontier you want to explore.
                  Our core team reads every message. We typically reply within{' '}
                  <span className="text-white/85">24 hours</span>.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Direct line
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-cyan transition-colors"
                >
                  {CONTACT_EMAIL}
                  <span className="h-[1px] w-4 bg-gradient-to-r from-cyan to-cyber-violet" />
                </a>
              </div>
            </motion.div>

            {/* Right: Form */}
            <div className="flex items-center justify-end md:justify-center lg:justify-end">
              <div className="w-full max-w-md md:max-w-sm lg:max-w-md">
                <GlassContactForm />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
