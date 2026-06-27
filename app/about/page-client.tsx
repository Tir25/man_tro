'use client'

import { useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Header } from '@/components/ui/Header'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AboutSectionCard, ABOUT_SECTIONS } from '@/components/ui/AboutSectionCard'
import { useAboutSections } from '@/hooks/useAboutSections'
import type { ParticleBrainHandle } from '@/components/effects/ParticleBrain'

// Lazy load ParticleBrain with error boundary
const ParticleBrain = dynamic(
  () => import('@/components/effects/ParticleBrain').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 flex items-center justify-center bg-void">
        <div className="h-16 w-16 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
      </div>
    ),
  }
)

export function AboutPageClient() {
  const brainRef = useRef<ParticleBrainHandle | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Use custom hook for scroll-based morphing
  const { sectionRefs } = useAboutSections(
    (shapeIndex) => brainRef.current?.morphToShape(shapeIndex)
  )

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#030304] text-slate-100">
      {/* 3D Particle Background */}
      <ErrorBoundary
        fallback={
          <div className="fixed inset-0 z-0 flex items-center justify-center bg-void">
            <div className="text-center text-white/60">
              <p className="text-sm">3D scene unavailable</p>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="fixed inset-0 z-0 flex items-center justify-center bg-void">
              <div className="h-16 w-16 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
            </div>
          }
        >
          <ParticleBrain ref={brainRef} />
        </Suspense>
      </ErrorBoundary>

      <main className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="pointer-events-none flex min-h-[60vh] items-end justify-center pb-10">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-xs uppercase tracking-[0.3em] text-slate-400"
            >
              About Me
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
              className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl md:text-6xl"
            >
              Ethereal industrialism,
              <span className="bg-gradient-to-r from-[#4CC9F0] via-slate-200 to-[#7B2CBF] bg-clip-text text-transparent">
                {' '}
                engineered into the web.
              </span>
            </motion.h1>
          </div>
        </section>

        {/* Introduction Card */}
        <section className="flex justify-center px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.4, once: false }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative max-w-4xl space-y-6 overflow-hidden rounded-3xl border border-white/10 bg-black/40 px-8 py-10 text-left shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl sm:px-12 sm:py-14"
          >
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(76,201,240,0.35),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(123,44,191,0.45),_transparent_60%)]" />
            </div>

            <div className="relative space-y-6 text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
              <p>
                Hi, I&rsquo;m Tirth Raval, a freelance Full-Stack Web Developer, Frontend Engineer, and App Developer. I operate under my studio name, Mantro, which is dedicated to transforming ideas into powerful digital experiences. I design and build high-performance websites, scalable web applications, and intuitive Android applications.
              </p>
              <p>
                My vision is simple: make technology feel effortless. Whether you&rsquo;re a startup launching for the first
                time or a business upgrading your digital presence, I deliver solutions that are
                elegant, efficient, and built for long-term growth.
              </p>
              <p>
                I combine clean design, advanced engineering, and user-centric thinking to create products that don&rsquo;t just
                work&mdash;but work beautifully. When you hire me, you get a dedicated partner focused on pushing boundaries and helping your brand stand out in a fast-moving digital world.
              </p>
              <p>Let&rsquo;s build something amazing together.</p>
            </div>
          </motion.div>
        </section>

        {/* Scrollytelling Sections */}
        <AboutSectionCard
          section={ABOUT_SECTIONS[0]}
          sectionRef={sectionRefs.genesisRef}
        />
        <AboutSectionCard
          section={ABOUT_SECTIONS[1]}
          sectionRef={sectionRefs.expansionRef}
        />
        <AboutSectionCard
          section={ABOUT_SECTIONS[2]}
          sectionRef={sectionRefs.fluxRef}
        />
        <AboutSectionCard
          section={ABOUT_SECTIONS[3]}
          sectionRef={sectionRefs.foundationRef}
        />

        {/* Footer Section */}
        <section className="flex min-h-[60vh] items-center justify-center px-4 pb-16">
          <div className="mx-auto max-w-3xl text-center text-sm text-slate-400">
            <p>
              Mantro is the freelance studio of Tirth Raval &mdash; where modern web technologies,
              motion, and engineering converge into premium digital experiences.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
