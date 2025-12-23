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
 * Mobile: Uses CSS animations for better performance
 * Desktop: Uses Framer Motion with hover-to-pause
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

  // Reduce items on mobile for better performance
  const duplicationCount = isMobile ? 2 : 3
  const duplicatedTop = useMemo(
    () => duplicateArray(topTrackTechs, duplicationCount),
    [duplicationCount]
  )
  const duplicatedBottom = useMemo(
    () => duplicateArray(bottomTrackTechs, duplicationCount),
    [duplicationCount]
  )

  // Desktop-only animation variants
  const topVariants = useMemo(
    () => createMarqueeVariants('forward', 1200),
    []
  )
  const bottomVariants = useMemo(
    () => createMarqueeVariants('reverse', 800),
    []
  )

  const isVisible = inView

  // Desktop: Control animations based on visibility
  useEffect(() => {
    if (isMobile) return // Skip JS animations on mobile

    if (isVisible) {
      topControls.start('animate')
      bottomControls.start('animate')
    } else {
      topControls.stop()
      bottomControls.stop()
    }
  }, [isVisible, topControls, bottomControls, isMobile])

  // Desktop-only hover handlers
  const handleTopEnter = useCallback(() => {
    if (isMobile) return
    setIsTopHovered(true)
    topControls.stop()
  }, [topControls, isMobile])

  const handleTopLeave = useCallback(() => {
    if (isMobile) return
    setIsTopHovered(false)
    if (isVisible) topControls.start('animate')
  }, [topControls, isVisible, isMobile])

  const handleBottomEnter = useCallback(() => {
    if (isMobile) return
    setIsBottomHovered(true)
    bottomControls.stop()
  }, [bottomControls, isMobile])

  const handleBottomLeave = useCallback(() => {
    if (isMobile) return
    setIsBottomHovered(false)
    if (isVisible) bottomControls.start('animate')
  }, [bottomControls, isVisible, isMobile])

  return (
    <SectionWrapper
      id="tech-stack"
      className={cn(
        'relative overflow-hidden py-16 sm:py-24 md:py-32',
        'bg-void',
        // Simplified grid on mobile
        !isMobile && 'before:absolute before:inset-0 before:opacity-5',
        !isMobile && 'before:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]',
        !isMobile && 'before:bg-[size:40px_40px]',
        'before:pointer-events-none',
        className
      )}
    >
      <div ref={containerRef} className="container mx-auto px-4 relative z-10">
        {/* Title - Mobile optimized */}
        <div className="mb-10 sm:mb-16 text-center">
          <Typography variant="h2" className="mb-2 sm:mb-4 text-balance text-2xl sm:text-3xl md:text-4xl">
            Precision Meets Dreaming
          </Typography>
          <Typography variant="body" className="mx-auto max-w-3xl text-gray-400 text-sm sm:text-base">
            {isMobile
              ? 'Technologies powering our digital experiences.'
              : 'The technologies that power our digital experiences. Hover to illuminate.'
            }
          </Typography>
        </div>

        {/* Track 1 - Frontend & Mobile */}
        <div
          className="relative mb-6 sm:mb-8 overflow-hidden"
          onMouseEnter={handleTopEnter}
          onMouseLeave={handleTopLeave}
        >
          {/* Fade edges - smaller on mobile */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

          {isMobile ? (
            // Mobile: CSS-based animation for better performance
            <div
              className="flex gap-3 animate-marquee-mobile"
              style={{
                width: 'max-content',
                animationPlayState: isVisible ? 'running' : 'paused'
              }}
            >
              {duplicatedTop.map((tech, idx) => (
                <TechChipCard key={`top-${tech.name}-${idx}`} tech={tech} isHovered={false} compact />
              ))}
            </div>
          ) : (
            // Desktop: Framer Motion with hover support
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
          )}
        </div>

        {/* Energy Line Divider - Simplified on mobile */}
        <div className="relative h-px bg-white/10 mb-6 sm:mb-8 overflow-hidden">
          {!isMobile && isVisible && (
            <motion.div
              className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent will-change-transform"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
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
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

          {isMobile ? (
            // Mobile: CSS-based animation (reverse direction)
            <div
              className="flex gap-3 animate-marquee-mobile-reverse"
              style={{
                width: 'max-content',
                animationPlayState: isVisible ? 'running' : 'paused'
              }}
            >
              {duplicatedBottom.map((tech, idx) => (
                <TechChipCard key={`bottom-${tech.name}-${idx}`} tech={tech} isHovered={false} compact />
              ))}
            </div>
          ) : (
            // Desktop: Framer Motion
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
          )}
        </div>
      </div>
    </SectionWrapper>
  )
})

TechStackEngine.displayName = 'TechStackEngine'
