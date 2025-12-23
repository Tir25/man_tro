'use client'

import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'
import { SectionWrapper } from './SectionWrapper'
import { Typography } from './Typography'
import { cn } from '@/lib/utils'
import { isMobileDevice } from '@/lib/deviceDetection'

const manifestoParagraphs = [
  'At Mantro, we believe technology should make life easier.',
  'We build websites, applications, and AI agents that are useful, reliable, and easy to use.',
  "We don't chase trends--we listen, understand, and create with care.",
  'Our goal is simple: technology that feels good and works well.',
  'We are Mantro--small team, big dedication, always improving.',
]

interface ManifestoProps {
  className?: string
}

// Lightweight stagger animation - animates whole paragraphs instead of per-word
const paragraphVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out
    },
  }),
}

/**
 * Manifesto - Company values section with optimized animations
 * Uses paragraph-level animations instead of per-word for better scroll performance
 */
export const Manifesto = memo(function Manifesto({ className }: ManifestoProps) {
  const isMobile = useMemo(() => isMobileDevice(), [])

  return (
    <SectionWrapper
      id="manifesto"
      className={cn(
        'relative isolate overflow-visible bg-gradient-to-b from-void to-[#050509]',
        'rounded-t-[2.5rem] px-4 py-24 md:py-32',
        className
      )}
    >
      {/* Static gradient background - no 3D for better performance */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(123,44,191,0.25), transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030304]/40 via-[#030304]/80 to-[#030304]/95" />
      </div>

      {/* Subtle glow */}
      <div
        className="absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-cyber-violet/20 blur-[100px]"
        aria-hidden
      />

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <Typography variant="h2" className="mb-10 text-balance">
          Manifesto
        </Typography>

        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/5 bg-black/60 p-10 shadow-[0_0_60px_rgba(76,201,240,0.08)]">
          <div className="space-y-6 text-lg text-white/85 md:text-xl">
            {manifestoParagraphs.map((paragraph, index) => (
              isMobile ? (
                <p key={index} className="leading-relaxed text-balance">
                  {paragraph}
                </p>
              ) : (
                <motion.p
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5, margin: '-50px' }}
                  variants={paragraphVariants}
                  className="leading-relaxed text-balance"
                >
                  {paragraph}
                </motion.p>
              )
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
})
