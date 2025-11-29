'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { SectionWrapper } from './SectionWrapper'
import { Typography } from './Typography'
import { cn } from '@/lib/utils'
import { isMobileDevice } from '@/lib/deviceDetection'
import { useMemo } from 'react'

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

const ManifestoBackground = dynamic(
  () => import('@/components/effects/HeroScene').then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(123,44,191,0.2),_transparent_60%)]" />
    ),
  }
)

export function Manifesto({ className }: ManifestoProps) {
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
      <div className="absolute inset-0 -z-10">
        <ManifestoBackground className="h-full w-full opacity-80 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030304]/40 via-[#030304]/80 to-[#030304]/95 backdrop-blur-[2px]" />
      </div>
      <div className="absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-cyber-violet/30 blur-[140px]" aria-hidden />
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <Typography variant="h2" className="mb-10 text-balance">
          Manifesto
        </Typography>
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/5 bg-black/60 p-10 shadow-[0_0_60px_rgba(76,201,240,0.08)]">
          <div className="space-y-8 text-lg text-white/85 md:text-xl">
            {manifestoParagraphs.map((paragraph, paragraphIndex) => (
              isMobile ? (
                <p key={paragraph} className="leading-relaxed text-balance">
                  {paragraph}
                </p>
              ) : (
                <motion.p
                  key={paragraph}
                  className="leading-relaxed text-balance will-change-transform"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: paragraphIndex * 0.1 } },
                  }}
                >
                  {paragraph.split(' ').map((word, wordIndex) => (
                    <motion.span
                      key={`${word}-${wordIndex}`}
                      className="inline-block will-change-transform"
                      initial={{ opacity: 0, filter: 'blur(12px)', y: 12 }}
                      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: paragraphIndex * 0.15 + wordIndex * 0.03,
                      }}
                      viewport={{ once: true, amount: 0.8 }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.p>
              )
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
