'use client'

import { cn } from '@/lib/utils'

export interface LiquidNavbarProps {
  className?: string
}

// SVG noise texture using feTurbulence for authentic glass noise
// Unique filter ID prevents conflicts if multiple navbars exist
const noiseTexture = `data:image/svg+xml;base64,${btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="liquidNavbarNoise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#liquidNavbarNoise)"/></svg>'
)}`

export function LiquidNavbar({ className }: LiquidNavbarProps) {
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'backdrop-blur-xl bg-black/20',
        className
      )}
    >
      {/* Noise texture overlay - 5% opacity for physical glass feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url(${noiseTexture})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
        }}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand area - placeholder */}
          <div className="text-white font-bold text-xl">
            MANTRO
          </div>
          
          {/* Navigation items - placeholder */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#work" className="text-white/80 hover:text-white text-sm transition-colors">
              Work
            </a>
            <a href="#services" className="text-white/80 hover:text-white text-sm transition-colors">
              Services
            </a>
            <a href="#about" className="text-white/80 hover:text-white text-sm transition-colors">
              About
            </a>
            <a href="#contact" className="text-white/80 hover:text-white text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
      
      {/* Gradient border effect using pseudo-element */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        }}
      />
    </nav>
  )
}

