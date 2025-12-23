'use client'

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { useMemo, useRef, memo } from 'react'
import { isMobileDevice } from '@/lib/deviceDetection'

/**
 * MaskMagicHero - Immersive hero section with scroll-synced scaling
 * Desktop: Scroll-synced scale animation
 * Mobile: Entrance animation with subtle pulse effect
 */
export const MaskMagicHero = memo(function MaskMagicHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMemo(() => isMobileDevice(), [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Desktop: Scroll-synced scale
  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.8],
    [1, 4]
  )

  const smoothScale = useSpring(scrollScale, {
    stiffness: 80,
    damping: 25,
    mass: 0.4,
    restDelta: 0.001,
  })

  // Mobile entrance animation variants
  const mobileVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      aria-label="MANTRO immersive hero"
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
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

      {isMobile || prefersReducedMotion ? (
        // Mobile: Entrance animation only
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={mobileVariants}
          className="font-black uppercase leading-none tracking-[0.06em] text-[22vw] sm:text-[18vw] bg-gradient-to-br from-[#fdf2ff] via-[#7B2CBF] to-[#4CC9F0] text-transparent bg-clip-text"
        >
          MANTRO
        </motion.h1>
      ) : (
        // Desktop: Scroll-synced scaling
        <motion.h1
          style={{
            scale: smoothScale,
            translateZ: 0,
          }}
          className="font-black uppercase leading-none tracking-[0.08em] text-[20vw] md:text-[18vw] lg:text-[16vw] bg-gradient-to-br from-[#fdf2ff] via-[#7B2CBF] to-[#4CC9F0] text-transparent bg-clip-text will-change-transform"
        >
          MANTRO
        </motion.h1>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-8 sm:bottom-10 flex justify-center text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/50">
        Scroll
      </div>
    </section>
  )
})

MaskMagicHero.displayName = 'MaskMagicHero'
