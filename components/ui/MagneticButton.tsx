'use client'

import { type ReactNode, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { transition as smoothTransition } from '@/src/lib/smooth-motion'

export interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  magneticStrength?: number // How strong the magnetic effect is (default: 0.3)
}

export function MagneticButton({
  children,
  className,
  onClick,
  type = 'button',
  disabled = false,
  magneticStrength = 0.3,
}: MagneticButtonProps): ReactNode {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Motion values for magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring animation for smooth movement
  const springConfig = {
    damping: smoothTransition.damping ?? 20,
    stiffness: smoothTransition.stiffness ?? 100,
    mass: smoothTransition.mass ?? 1,
  }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!buttonRef.current || disabled) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    // Apply magnetic strength
    x.set(distanceX * magneticStrength)
    y.set(distanceY * magneticStrength)
  }

  const handleMouseLeave = (): void => {
    x.set(0)
    y.set(0)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (disabled) return

    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Create ripple
      const newRipple = {
        id: Date.now(),
        x,
        y,
      }

      setRipples((prev) => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
      }, 600)
    }

    onClick?.(e)
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-medium',
        'backdrop-blur-md border border-glass-border bg-white/5',
        'text-white transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void focus:ring-cyber-violet',
        'disabled:opacity-50 disabled:pointer-events-none',
        'overflow-hidden',
        className
      )}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{
              width: 200,
              height: 200,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

