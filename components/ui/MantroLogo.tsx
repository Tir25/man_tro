'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

interface MantroLogoProps {
  className?: string
  /** Size in pixels for both width and height of the symbol SVG */
  size?: number
  /** Toggle the \"MANTRO\" wordmark on or off */
  text?: boolean
  /** Optional stable ID for gradient. If provided, useId() will not be used to prevent hydration issues */
  gradientId?: string
}

export function MantroLogo({
  className,
  size = 40,
  text = true,
  gradientId: providedGradientId,
}: MantroLogoProps) {
  // Use provided ID, or fallback to useId() for dynamic instances
  // For static instances (like Header), always provide a stable gradientId
  const generatedId = useId()
  const gradientId = providedGradientId ?? `mantro-gradient-${generatedId}`

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        role="img"
        aria-hidden={!text}
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#4CC9F0" />
            <stop offset="50%" stopColor="#7B2CBF" />
            <stop offset="100%" stopColor="#F72585" />
          </linearGradient>
          <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer geometric frame */}
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="12"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          fill="rgba(15,23,42,0.4)"
        />

        {/* Premium continuous line abstract 'M' */}
        <path
          d="M 10 28 L 10 14 L 20 24 L 30 14 L 30 28"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={`url(#glow-${gradientId})`}
        />
        
        {/* Ethereal architectural accent lines */}
        <path
          d="M 10 14 L 20 8 L 30 14"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="20" cy="8" r="1.5" fill="#4CC9F0" />
      </svg>

      {text && (
        <span className="text-white font-bold tracking-tight uppercase text-base">
          MANTRO
        </span>
      )}
    </div>
  )
}

export type { MantroLogoProps }



