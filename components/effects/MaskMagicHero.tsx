'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useRef, memo, useState, useEffect } from 'react'
import { isMobileDevice } from '@/lib/deviceDetection'

/**
 * MaskMagicHero - Immersive hero section
 * Desktop: Scroll-synced scale animation  
 * Mobile: Entrance animation with fade + scale
 */
export const MaskMagicHero = memo(function MaskMagicHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Use state + effect for mobile detection to handle SSR correctly
  const [isMobile, setIsMobile] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setHasHydrated(true)
  }, [])

  // Mobile/reduced motion: entrance animation variants
  const mobileVariants = {
    hidden: {
      opacity: 0,
      scale: 0.85,
      y: 30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    }
  }

  // Desktop: entrance + subtle float animation
  const desktopVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    }
  }

  // Show loading state briefly during hydration to prevent flash
  if (!hasHydrated) {
    return (
      <section
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
        aria-label="MANTRO immersive hero"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 30% 30%, rgba(123,44,191,0.4), transparent 60%),
                radial-gradient(ellipse 50% 35% at 70% 60%, rgba(76,201,240,0.3), transparent 55%)
              `,
            }}
          />
        </div>
        <h1 className="font-black uppercase leading-none tracking-[0.06em] text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] bg-gradient-to-br from-[#fdf2ff] via-[#7B2CBF] to-[#4CC9F0] text-transparent bg-clip-text opacity-0">
          MANTRO
        </h1>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      aria-label="MANTRO immersive hero"
    >
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 30% 30%, rgba(123,44,191,0.4), transparent 60%),
              radial-gradient(ellipse 50% 35% at 70% 60%, rgba(76,201,240,0.3), transparent 55%)
            `,
          }}
          aria-hidden="true"
        />
      </div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={isMobile || prefersReducedMotion ? mobileVariants : desktopVariants}
        className="font-black uppercase leading-none tracking-[0.06em] text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] bg-gradient-to-br from-[#fdf2ff] via-[#7B2CBF] to-[#4CC9F0] text-transparent bg-clip-text"
      >
        MANTRO
      </motion.h1>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-8 sm:bottom-10 flex justify-center text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Scroll
      </motion.div>
    </section>
  )
})

MaskMagicHero.displayName = 'MaskMagicHero'
