'use client'

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { useMemo, useRef, memo } from 'react'
import { isMobileDevice } from '@/lib/deviceDetection'

/**
 * MaskMagicHero - Immersive hero section with scroll-synced scaling
 * Optimized for performance with reduced motion support and GPU acceleration
 */
export const MaskMagicHero = memo(function MaskMagicHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const isMobile = useMemo(() => isMobileDevice(), [])

  // Simplified scale transform - less extreme scaling for better performance
  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.8], // End earlier for snappier feel
    [1, isMobile ? 1 : 4] // Less extreme scale on desktop
  )

  // Optimized spring with lower stiffness for smoother animation
  const smoothScale = useSpring(scrollScale, {
    stiffness: 80,  // Lower stiffness = smoother (was 120)
    damping: 25,    // Slightly lower damping
    mass: 0.4,      // Lower mass = quicker response (was 0.6)
    restDelta: 0.001,
  })

  // Skip animations for reduced motion preference
  const finalScale = prefersReducedMotion || isMobile ? 1 : smoothScale

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      aria-label="MANTRO immersive hero"
      style={{
        // GPU acceleration hints
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Simplified gradient background - CSS only, no JS animation */}
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
        style={{
          scale: finalScale,
          // GPU acceleration
          translateZ: 0,
        }}
        className={`
          font-black uppercase leading-none tracking-[0.08em]
          ${isMobile
            ? 'text-[18vw] sm:text-[16vw] md:text-[14vw]'
            : 'text-[20vw] md:text-[18vw] lg:text-[16vw]'
          }
          bg-gradient-to-br from-[#fdf2ff] via-[#7B2CBF] to-[#4CC9F0] 
          text-transparent bg-clip-text
          will-change-transform
        `}
      >
        MANTRO
      </motion.h1>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center text-xs uppercase tracking-[0.3em] text-white/60">
        Scroll
      </div>
    </section>
  )
})

MaskMagicHero.displayName = 'MaskMagicHero'
