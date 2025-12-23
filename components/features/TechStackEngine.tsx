'use client'

import { useState, useMemo, useEffect, memo, useCallback, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Typography } from '@/components/ui/Typography'
import { TechChipCard } from '@/components/ui/TechChipCard'
import { cn } from '@/lib/utils'
import { isMobileDevice } from '@/lib/deviceDetection'
import {
  topTrackTechs,
  bottomTrackTechs,
  duplicateArray,
  createMarqueeVariants,
} from '@/lib/techStackData'

/**
 * TechStackEngine - Animated marquee display of technology stack
 * Features two-track marquee with hover-to-pause and intersection-based animation control
 */
export const TechStackEngine = memo(function TechStackEngine({
  className,
}: {
  className?: string
}) {
  const [isTopHovered, setIsTopHovered] = useState(false)
  const [isBottomHovered, setIsBottomHovered] = useState(false)
  const topControls = useAnimation()
  const bottomControls = useAnimation()
  const isMobile = useMemo(() => isMobileDevice(), [])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(containerRef, { margin: '-10% 0px -10% 0px', amount: 0.2 })

  // Optimize duplication - reduce on mobile for better performance
  const duplicationCount = isMobile ? 2 : 3
  const duplicatedTop = useMemo(
    () => duplicateArray(topTrackTechs, duplicationCount),
    [duplicationCount]
  )
  const duplicatedBottom = useMemo(
    () => duplicateArray(bottomTrackTechs, duplicationCount),
    [duplicationCount]
  )

  // Memoize variant creators
  const topVariants = useMemo(
    () => createMarqueeVariants('forward', isMobile ? 800 : 1200),
    [isMobile]
  )
  const bottomVariants = useMemo(
    () => createMarqueeVariants('reverse', isMobile ? 600 : 800),
    [isMobile]
  )

  const isVisible = inView

  // Start animations on mount and when visible
  useEffect(() => {
    if (isVisible) {
      topControls.start('animate')
      bottomControls.start('animate')
    } else {
      topControls.stop()
      bottomControls.stop()
    }
  }, [isVisible, topControls, bottomControls])

  // Optimized event handlers
  const handleTopEnter = useCallback(() => {
    setIsTopHovered(true)
    topControls.stop()
  }, [topControls])

  const handleTopLeave = useCallback(() => {
    setIsTopHovered(false)
    if (isVisible) topControls.start('animate')
  }, [topControls, isVisible])

  const handleBottomEnter = useCallback(() => {
    setIsBottomHovered(true)
    bottomControls.stop()
  }, [bottomControls])

  const handleBottomLeave = useCallback(() => {
    setIsBottomHovered(false)
    if (isVisible) bottomControls.start('animate')
  }, [bottomControls, isVisible])

  return (
    <SectionWrapper
      id="tech-stack"
      className={cn(
        'relative overflow-hidden py-24 md:py-32',
        'bg-void',
        'before:absolute before:inset-0 before:opacity-5',
        'before:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]',
        'before:bg-[size:40px_40px]',
        'before:pointer-events-none',
        'before:will-change-auto',
        className
      )}
    >
      <div ref={containerRef} className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="mb-16 text-center">
          <Typography variant="h2" className="mb-4 text-balance">
            Precision Meets Dreaming
          </Typography>
          <Typography variant="body" className="mx-auto max-w-3xl text-gray-400">
            The technologies that power our digital experiences. Hover to illuminate.
          </Typography>
        </div>

        {/* Track 1 - Frontend & Mobile */}
        <div
          className="relative mb-8 overflow-hidden"
          onMouseEnter={handleTopEnter}
          onMouseLeave={handleTopLeave}
        >
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-4 will-change-transform"
            variants={topVariants}
            animate={topControls}
            style={{ width: 'max-content' }}
          >
            {duplicatedTop.map((tech, idx) => (
              <TechChipCard key={`top-${tech.name}-${idx}`} tech={tech} isHovered={isTopHovered} />
            ))}
          </motion.div>
        </div>

        {/* Energy Line Divider */}
        <div className="relative h-px bg-white/10 mb-8 overflow-hidden">
          {isVisible && (
            <motion.div
              className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent will-change-transform"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: isMobile ? 4 : 3, ease: 'linear' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>

        {/* Track 2 - Backend */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={handleBottomEnter}
          onMouseLeave={handleBottomLeave}
        >
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-4 will-change-transform"
            variants={bottomVariants}
            animate={bottomControls}
            style={{ width: 'max-content' }}
          >
            {duplicatedBottom.map((tech, idx) => (
              <TechChipCard key={`bottom-${tech.name}-${idx}`} tech={tech} isHovered={isBottomHovered} />
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
})

TechStackEngine.displayName = 'TechStackEngine'
