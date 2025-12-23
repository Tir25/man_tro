'use client'

import { motion } from 'framer-motion'
import { memo, useState, useEffect } from 'react'
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

// Animation variants for paragraphs
const paragraphVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

/**
 * Manifesto - Company values section
 * Mobile: Static text (no animations) for performance
 * Desktop: Paragraph-level fade animations
 */
export const Manifesto = memo(function Manifesto({ className }: ManifestoProps) {
  // Use state + effect for mobile detection to handle SSR correctly
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  return (
    <SectionWrapper
      id="manifesto"
      className={cn(
        'relative isolate overflow-visible bg-gradient-to-b from-void to-[#050509]',
        'rounded-t-[2rem] sm:rounded-t-[2.5rem] px-4 py-16 sm:py-24 md:py-32',
        className
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(123,44,191,0.2), transparent 70%)',
          }}
        />
        {/* Reduced overlay opacity on mobile for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030304]/20 via-[#030304]/60 to-[#030304]/90" />
      </div>

      {/* Subtle glow */}
      <div
        className="absolute inset-x-0 -top-24 mx-auto h-32 sm:h-48 w-32 sm:w-48 rounded-full bg-cyber-violet/15 blur-[80px] sm:blur-[100px]"
        aria-hidden
      />

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <Typography variant="h2" className="mb-6 sm:mb-10 text-balance text-2xl sm:text-3xl md:text-4xl">
          Manifesto
        </Typography>

        <div className="mx-auto max-w-3xl rounded-2xl sm:rounded-[2rem] border border-white/10 bg-black/70 p-6 sm:p-10 shadow-[0_0_40px_rgba(76,201,240,0.05)]">
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl">
            {manifestoParagraphs.map((paragraph, index) => (
              isMobile ? (
                // Mobile: Static paragraphs with full opacity
                <p
                  key={index}
                  className="leading-relaxed text-balance text-white/90"
                >
                  {paragraph}
                </p>
              ) : (
                // Desktop: Animated paragraphs
                <motion.p
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  variants={paragraphVariants}
                  className="leading-relaxed text-balance text-white/90"
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
