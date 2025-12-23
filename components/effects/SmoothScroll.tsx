'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { isMobileDevice } from '@/lib/deviceDetection'

interface SmoothScrollProps {
  children: ReactNode
}

/**
 * SmoothScroll - Provides butter-smooth scrolling using Lenis
 * Optimized for performance with reduced lerp and proper RAF management
 */
export function SmoothScroll({ children }: SmoothScrollProps): ReactNode {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const onMobile = isMobileDevice()

    // Use native scroll on mobile for better performance
    if (onMobile) {
      root.dataset.nativeScroll = 'true'
      return () => {
        delete root.dataset.nativeScroll
      }
    }

    delete root.dataset.nativeScroll

    // Optimized Lenis configuration for smooth, lightweight scrolling
    const lenis = new Lenis({
      duration: 0.8,      // Slightly faster response (was 1.1)
      lerp: 0.12,         // Slightly higher lerp for snappier feel (was 0.1)
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // Simpler cubic easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,   // Normal scroll speed (was 0.8)
      touchMultiplier: 1.5, // Better touch response
      infinite: false,
    })

    lenisRef.current = lenis

    // Use performance.now() for more accurate timing
    let lastTime = performance.now()

    const raf = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      // Only update if enough time has passed (target ~60fps)
      if (deltaTime > 0) {
        lenis.raf(time)
      }

      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
