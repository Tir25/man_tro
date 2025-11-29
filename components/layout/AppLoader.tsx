'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MantroLogo } from '@/components/ui/MantroLogo'

interface AppLoaderProps {
  onComplete?: () => void
}

/**
 * Global preloader component that tracks page readiness
 * Provides a smooth, branded loading experience before revealing the site
 */
export function AppLoader({ onComplete }: AppLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [shouldHide, setShouldHide] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Format progress with padding for monospace display
  const progressText = Math.round(progress).toString().padStart(2, '0')

  // Only render on client to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Lock body scroll while loading
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      // Cleanup: restore body scroll
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return

    let progressValue = 0
    let startTime = Date.now()
    const minDisplayTime = 1200 // Minimum 1.2 seconds for smooth UX
    const maxTime = 3000 // Maximum 3 seconds before forcing completion

    // Simulate smooth progress animation
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      
      // Accelerate progress: faster at start, slower near end
      if (progressValue < 90) {
        progressValue = Math.min(90, (elapsed / maxTime) * 90)
      } else {
        // Slow down near completion
        progressValue = Math.min(99, 90 + ((elapsed - (maxTime * 0.9)) / (maxTime * 0.1)) * 9)
      }
      
      setProgress(progressValue)

      // Check if page is ready
      if (document.readyState === 'complete' && progressValue >= 90) {
        progressValue = 100
        setProgress(100)
        clearInterval(progressInterval)
        
        // Ensure minimum display time
        const remainingTime = minDisplayTime - elapsed
        const waitTime = Math.max(0, remainingTime)
        
        setTimeout(() => {
          // Wait 500ms then trigger exit animation
          setTimeout(() => {
            setShouldHide(true)
            
            // Restore body scroll after fade-out completes
            setTimeout(() => {
              if (typeof document !== 'undefined') {
                document.body.style.overflow = ''
              }
              onComplete?.()
            }, 800) // Match animation duration
          }, 500)
        }, waitTime)
      }
    }, 16) // ~60fps updates

    // Fallback: force completion after max time
    const forceCompleteTimer = setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      
      setTimeout(() => {
        setShouldHide(true)
        setTimeout(() => {
          if (typeof document !== 'undefined') {
            document.body.style.overflow = ''
          }
          onComplete?.()
        }, 800)
      }, 500)
    }, maxTime)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(forceCompleteTimer)
    }
  }, [isMounted, onComplete])

  // Don't render during SSR or if we've hidden
  if (!isMounted || shouldHide) {
    return null
  }

  return (
    <AnimatePresence>
        {!shouldHide && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: shouldHide ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030304]"
            style={{ pointerEvents: shouldHide ? 'none' : 'auto' }}
          >
          {/* Centered Logo with pulse animation */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-12"
          >
            <MantroLogo 
              size={80} 
              text={false}
              gradientId="mantro-loader-gradient"
            />
          </motion.div>

          {/* Progress Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 font-mono text-sm uppercase tracking-[0.3em] text-white/60"
          >
            INITIALIZING REALITY...{' '}
            <span className="text-cyan">{progressText}%</span>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs px-8">
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan via-cyber-violet to-cyan"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ width: '50%' }}
              />
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
  )
}

