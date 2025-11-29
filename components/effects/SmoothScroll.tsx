'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { isMobileDevice } from '@/lib/deviceDetection'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps): ReactNode {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const onMobile = isMobileDevice()

    if (onMobile) {
      root.dataset.nativeScroll = 'true'
      return () => {
        delete root.dataset.nativeScroll
      }
    }

    delete root.dataset.nativeScroll

    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1,
      infinite: false,
    })

    lenisRef.current = lenis

    const raf = (time: number) => {
      lenis.raf(time)
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
