'use client'

import React, { useId } from 'react'
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
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4CC9F0" />
            <stop offset="100%" stopColor="#7B2CBF" />
          </linearGradient>
        </defs>

        {/* Background container to keep the symbol visually heavy and balanced */}
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="10"
          ry="10"
          fill="rgba(15,23,42,0.9)"
        />

        {/* Left pillar */}
        <rect
          x="8"
          y="10"
          width="6"
          height="20"
          rx="3"
          ry="3"
          fill="#FFFFFF"
        />

        {/* Right pillar */}
        <rect
          x="26"
          y="10"
          width="6"
          height="20"
          rx="3"
          ry="3"
          fill="#FFFFFF"
        />

        {/* Central gradient bridge – geometric abstraction of the M apex */}
        <path
          d="
            M 11 12
            L 18 12
            L 20 9
            L 22 12
            L 29 12
            L 29 18
            L 23 18
            L 20 15
            L 17 18
            L 11 18
            Z
          "
          fill={`url(#${gradientId})`}
        />
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



