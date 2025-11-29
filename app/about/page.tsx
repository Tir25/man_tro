'use client'

'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll } from 'framer-motion'
import { Suspense } from 'react'
import { Header } from '@/components/ui/Header'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { ParticleBrainHandle } from '@/components/effects/ParticleBrain'

// Note: Metadata is handled in app/about/layout.tsx

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

export default function AboutPage() {
  const brainRef = useRef<ParticleBrainHandle | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const genesisRef = useRef<HTMLDivElement | null>(null)
  const expansionRef = useRef<HTMLDivElement | null>(null)
  const fluxRef = useRef<HTMLDivElement | null>(null)
  const foundationRef = useRef<HTMLDivElement | null>(null)

  // Track scroll progress for each section to determine which is most in view
  // Using 'start end' and 'end start' to get better detection range
  const genesisProgress = useScroll({
    target: genesisRef,
    offset: ['start end', 'end start'],
  }).scrollYProgress

  const expansionProgress = useScroll({
    target: expansionRef,
    offset: ['start end', 'end start'],
  }).scrollYProgress

  const fluxProgress = useScroll({
    target: fluxRef,
    offset: ['start end', 'end start'],
  }).scrollYProgress

  const foundationProgress = useScroll({
    target: foundationRef,
    offset: ['start end', 'end start'],
  }).scrollYProgress

  // Track the last active shape to prevent unnecessary morphs
  const lastActiveShapeRef = useRef<number | null>(null)

  // Determine which section is most in view
  // Progress of 0 means section is at 'start end' (entering viewport)
  // Progress of 1 means section is at 'end start' (leaving viewport)
  // Progress of 0.5 means section center is at viewport center
  const determineActiveShape = useCallback(() => {
    const progressValues = [
      genesisProgress.get(),
      expansionProgress.get(),
      fluxProgress.get(),
      foundationProgress.get(),
    ]

    // Find the section with the highest progress value that's in view
    // This prioritizes sections that are more "in view" (progress closer to 0.5)
    let bestScore = -1
    let activeIndex = 0

    progressValues.forEach((progress, index) => {
      // Only consider sections that are in view (progress between 0 and 1)
      if (progress >= 0 && progress <= 1) {
        // Score based on how close progress is to 0.5 (center of viewport)
        // Higher score = more centered in viewport
        const distanceFromCenter = Math.abs(progress - 0.5)
        const score = 1 - distanceFromCenter
        
        if (score > bestScore) {
          bestScore = score
          activeIndex = index
        }
      }
    })

    // Fallback: if no section is in view, use the first one with progress > 0
    if (bestScore < 0) {
      for (let i = 0; i < progressValues.length; i++) {
        if (progressValues[i] > 0) {
          activeIndex = i
          break
        }
      }
    }

    return activeIndex
  }, [genesisProgress, expansionProgress, fluxProgress, foundationProgress])

  // Update shape when scroll changes
  useEffect(() => {
    const updateShape = () => {
      const activeIndex = determineActiveShape()
      
      // Only morph if the shape has changed
      if (lastActiveShapeRef.current !== activeIndex) {
        lastActiveShapeRef.current = activeIndex
        brainRef.current?.morphToShape(activeIndex)
      }
    }

    // Subscribe to all progress changes
    const unsubscribes = [
      genesisProgress.on('change', updateShape),
      expansionProgress.on('change', updateShape),
      fluxProgress.on('change', updateShape),
      foundationProgress.on('change', updateShape),
    ]

    // Initial morph to sphere on load (after a short delay to ensure ParticleBrain is initialized)
    const timeoutId = setTimeout(() => {
      lastActiveShapeRef.current = 0
      brainRef.current?.morphToShape(0)
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      unsubscribes.forEach((unsub) => unsub())
    }
  }, [genesisProgress, expansionProgress, fluxProgress, foundationProgress, determineActiveShape])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#030304] text-slate-100">
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
        <section className="pointer-events-none flex min-h-[60vh] items-end justify-center pb-10">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-xs uppercase tracking-[0.3em] text-slate-400"
            >
              About Mantro
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
                Mantro is a modern technology studio dedicated to transforming ideas into powerful digital experiences. We
                design and build high-performance websites, scalable web applications, intelligent AI agents, and intuitive
                Android applications--crafted with precision, creativity, and deep engineering expertise.
              </p>
              <p>
                Our vision is simple: make technology feel effortless. Whether it&rsquo;s a business going digital for the first
                time or an enterprise upgrading to the next generation of software, Mantro delivers solutions that are
                elegant, efficient, and built for long-term growth.
              </p>
              <p>
                We combine clean design, advanced engineering, and user-centric thinking to create products that don&rsquo;t just
                work&mdash;but work beautifully. With every project, our goal is to push boundaries, empower businesses, and help
                brands stand out in a fast-moving digital world.
              </p>
              <p>At Mantro, innovation isn&rsquo;t a feature. It&rsquo;s our identity.</p>
            </div>
          </motion.div>
        </section>

        {/* 01 – The Genesis (Sphere) */}
        <section
          ref={genesisRef}
          className="flex min-h-[100vh] items-center justify-center px-4 py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 px-8 py-10 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(76,201,240,0.45),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(123,44,191,0.55),_transparent_60%)]" />
              </div>

              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400/80">
                  01 / THE GENESIS
                </p>
                <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  The Genesis
                </h2>
                <p className="text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
                  A collective intelligence with no edges.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 02 – The Expansion (Galaxy) */}
        <section
          ref={expansionRef}
          className="flex min-h-[100vh] items-center justify-center px-4 py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 px-8 py-10 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(76,201,240,0.45),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(123,44,191,0.55),_transparent_60%)]" />
              </div>

              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400/80">
                  02 / THE EXPANSION
                </p>
                <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  The Expansion
                </h2>
                <p className="text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
                  spiraling outwards into new possibilities.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 03 – The Flux (Wave) */}
        <section
          ref={fluxRef}
          className="flex min-h-[100vh] items-center justify-center px-4 py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 px-8 py-10 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(76,201,240,0.45),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(123,44,191,0.55),_transparent_60%)]" />
              </div>

              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400/80">
                  03 / THE FLUX
                </p>
                <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  The Flux
                </h2>
                <p className="text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
                  Adapting to the frequency of the modern web.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 04 – The Foundation (Cube) */}
        <section
          ref={foundationRef}
          className="flex min-h-[100vh] items-center justify-center px-4 py-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="mx-auto max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 px-8 py-10 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(76,201,240,0.45),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(123,44,191,0.55),_transparent_60%)]" />
              </div>

              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400/80">
                  04 / THE FOUNDATION
                </p>
                <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  The Foundation
                </h2>
                <p className="text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
                  Structured, pixel-perfect engineering.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="flex min-h-[60vh] items-center justify-center px-4 pb-16">
          <div className="mx-auto max-w-3xl text-center text-sm text-slate-400">
            <p>
              Mantro is a studio for immersive digital experiences — where WebGL,
              motion, and engineering converge into something quietly luminous.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}


