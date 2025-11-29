'use client'

import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { isMobileDevice } from '@/lib/deviceDetection'

export function MaskMagicHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const isInView = useInView(sectionRef, {
    margin: '-20% 0px -20% 0px',
    amount: 0.2,
  })

  const isMobile = useMemo(() => isMobileDevice(), [])

  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 5.5])
  const smoothScale = useSpring(scrollScale, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  })

  const animatedStyle = isMobile
    ? undefined
    : {
        filter: 'drop-shadow(0 0 10px rgba(76, 201, 240, 0.15))',
        backgroundImage:
          'radial-gradient(circle at 20% 20%, #fdf2ff 0%, #f0b3ff 15%, transparent 45%), radial-gradient(circle at 80% 30%, #7B2CBF 0%, #4CC9F0 35%, transparent 70%), radial-gradient(circle at 50% 80%, #1c85ff 0%, #5bf4ff 40%, transparent 80%)',
        backgroundSize: '200% 200%',
        animation: isInView ? 'textFlow 12s ease-in-out infinite alternate' : 'none',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        transformOrigin: 'center',
      } as const

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      aria-label="MANTRO immersive hero"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="flow-gradient" aria-hidden="true" />
        <div className="flow-gradient mix-blend-screen" style={{ animationDelay: '3s' }} aria-hidden="true" />
      </div>

      <motion.h1
        ref={headingRef}
        style={{
          // On mobile, avoid scroll-synced scaling to prevent clipping and jank
          scale: isMobile ? 1 : smoothScale,
          ...(animatedStyle ?? {}),
        }}
        className={
          isMobile
            ? 'text-[18vw] sm:text-[16vw] md:text-[14vw] font-black uppercase leading-none tracking-[0.08em] will-change-transform bg-gradient-to-br from-[#fdf2ff] via-[#7B2CBF] to-[#4CC9F0] text-transparent bg-clip-text'
            : 'text-[20vw] md:text-[18vw] lg:text-[16vw] font-black uppercase leading-none tracking-[0.08em] will-change-transform'
        }
      >
        MANTRO
      </motion.h1>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center text-xs uppercase tracking-[0.3em] text-white/60">
        Scroll
      </div>
    </section>
  )
}

