import { useEffect, useState } from 'react'
import { throttle } from '@/lib/throttle'

/**
 * Hook to track scroll position with throttling for better performance
 * @param threshold - The scroll threshold in pixels (default: 50)
 * @returns Boolean indicating if scrolled past threshold
 */
export function useScrollPosition(threshold = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > threshold)
    }, 16) // ~60fps throttling

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}

