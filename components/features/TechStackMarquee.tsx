'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Typography } from '@/components/ui/Typography'
import { cn } from '@/lib/utils'

interface TechLogo {
  name: string
  icon: React.ReactNode
  color: string
}

// Simple SVG icons for each tech
const techLogos: TechLogo[] = [
  {
    name: 'Next.js',
    icon: (
      <svg viewBox="0 0 394 80" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0zm-81.5 0H249v12.7h-13.6v53.9c0 7.1 3.2 10.7 9.5 10.7 3.2 0 5.4-.8 7.6-2.1l5.4 11.3c-3.2 2.1-8.1 3.6-13.6 3.6-13.6 0-22.6-7.1-22.6-20.3V12.7h-13.6V0zm-94.6 12.7H99c-7.6 0-13.6 5.4-13.6 13.6v40.7c0 7.6 6 13.6 13.6 13.6h12.7c7.6 0 13.6-6 13.6-13.6V26.3c0-7.6-6-13.6-13.6-13.6zm-1.4 13.6v40.7c0 1.4-1.4 2.8-2.8 2.8H90c-1.4 0-2.8-1.4-2.8-2.8V26.3c0-1.4 1.4-2.8 2.8-2.8h12.7c1.4 0 2.8 1.4 2.8 2.8z"
          fill="currentColor"
        />
        <path
          d="M0 0h68.5v12.7H27.2v27.2h35.6v12.7H27.2v27.2h41.3V80H0V0z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#000000',
  },
  {
    name: 'React',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-60 12 12)" />
      </svg>
    ),
    color: '#61DAFB',
  },
  {
    name: 'TypeScript',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="24" height="24" fill="#3178C6" />
        <path
          d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 7.699 7.699 0 0 0-1.007-.4 9.913 9.913 0 0 0-1.353-.493 4.778 4.778 0 0 1-1.176-.753 2.418 2.418 0 0 1-.537-.957c-.067-.359-.1-.776-.1-1.253 0-.558.098-1.047.294-1.467.196-.42.473-.776.83-1.067.358-.291.789-.515 1.293-.672.504-.157 1.07-.236 1.696-.236zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
          fill="#fff"
        />
      </svg>
    ),
    color: '#3178C6',
  },
  {
    name: 'Tailwind',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#06B6D4',
  },
  {
    name: 'Three.js',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l8 4v8.64l-8 4-8-4V8.18l8-4zm0 1.36L5.09 8 12 11.45 18.91 8 12 5.54zM5.09 16L12 19.45 18.91 16v-3.27L12 15.73 5.09 12.73V16z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#000000',
  },
  {
    name: 'Framer Motion',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l8 4v8.64l-8 4-8-4V8.18l8-4zm0 1.36L5.09 8 12 11.45 18.91 8 12 5.54zM5.09 16L12 19.45 18.91 16v-3.27L12 15.73 5.09 12.73V16z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#0055FF',
  },
  {
    name: 'Supabase',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#3ECF8E',
  },
  {
    name: 'Stripe',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 8.667 0 6.005 1.03 4.419 2.736 2.832 4.443 1.99 6.53 1.99 8.82c0 3.428 1.623 5.95 4.743 7.627l2.029-12.553h4.214zm-.186 5.562c-1.504.564-2.558 1.056-2.558 1.988 0 .678.565 1.108 1.504 1.108 1.186 0 2.74-.443 3.737-.838l.89-5.258z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#635BFF',
  },
  {
    name: 'OpenAI',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M22.282 9.821a5.985 5.985 0 0 0-.516-1.9l2.443-1.966a.8.8 0 0 0-.05-1.178l-2.79-2.79a.8.8 0 0 0-1.178-.05l-1.966 2.443a5.985 5.985 0 0 0-1.9-.516V.8a.8.8 0 0 0-.8-.8h-3.96a.8.8 0 0 0-.8.8v3.126a5.985 5.985 0 0 0-1.9.516L6.81 1.493a.8.8 0 0 0-1.178.05l-2.79 2.79a.8.8 0 0 0-.05 1.178l2.443 1.966a5.985 5.985 0 0 0-.516 1.9H.8a.8.8 0 0 0-.8.8v3.96a.8.8 0 0 0 .8.8h3.126a5.985 5.985 0 0 0 .516 1.9L1.993 19.12a.8.8 0 0 0 .05 1.178l2.79 2.79a.8.8 0 0 0 1.178.05l1.966-2.443a5.985 5.985 0 0 0 1.9.516V23.2a.8.8 0 0 0 .8.8h3.96a.8.8 0 0 0 .8-.8v-3.126a5.985 5.985 0 0 0 1.9-.516l1.966 2.443a.8.8 0 0 0 1.178.05l2.79-2.79a.8.8 0 0 0 .05-1.178l-2.443-1.966a5.985 5.985 0 0 0 .516-1.9H23.2a.8.8 0 0 0 .8-.8v-3.96a.8.8 0 0 0-.8-.8h-3.126zm-10.282 2.179a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#412991',
  },
  {
    name: 'Vercel',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    ),
    color: '#000000',
  },
]

const createMarqueeVariants = (direction: 'forward' | 'reverse') => ({
  animate: {
    x: direction === 'forward' ? [0, -1000] : [-1000, 0],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: 20,
        ease: 'linear',
      },
    },
  },
})

interface TechLogoItemProps {
  logo: TechLogo
  isHovered: boolean
}

function TechLogoItem({ logo, isHovered }: TechLogoItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'w-32 h-32 md:w-40 md:h-40',
        'transition-all duration-500',
        isHovered
          ? 'opacity-100 grayscale-0 brightness-110'
          : 'opacity-30 grayscale brightness-50'
      )}
      style={{
        filter: isHovered
          ? `drop-shadow(0 0 20px ${logo.color}) drop-shadow(0 0 40px ${logo.color}40)`
          : 'none',
      }}
    >
      <div className="w-20 h-20 md:w-28 md:h-28 text-white">
        {logo.icon}
      </div>
    </div>
  )
}

export function TechStackMarquee({ className }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const forwardControls = useAnimation()
  const reverseControls = useAnimation()

  // Duplicate logos for seamless loop
  const duplicatedLogos = useMemo(() => [...techLogos, ...techLogos], [])

  // Start animations on mount
  useEffect(() => {
    forwardControls.start('animate')
    reverseControls.start('animate')
  }, [forwardControls, reverseControls])

  return (
    <SectionWrapper
      id="tech-stack"
      className={cn(
        'relative overflow-hidden py-24 md:py-32',
        'before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        className
      )}
    >
      <div
        onMouseEnter={() => {
          setIsHovered(true)
          forwardControls.stop()
          reverseControls.stop()
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          forwardControls.start('animate')
          reverseControls.start('animate')
        }}
      >
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="mb-16 text-center">
          <Typography variant="h2" className="mb-4 text-balance">
            Precision Meets Dreaming
          </Typography>
          <Typography variant="body" className="mx-auto max-w-3xl text-gray-400">
            Built with the tools that define the future. Hover to illuminate.
          </Typography>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

          {/* Row 1 - Forward */}
          <div className="mb-8 overflow-hidden">
            <motion.div
              className="flex gap-8"
              variants={createMarqueeVariants('forward')}
              animate={forwardControls}
              style={{ width: 'max-content' }}
            >
              {duplicatedLogos.map((logo, idx) => (
                <TechLogoItem key={`forward-${idx}`} logo={logo} isHovered={isHovered} />
              ))}
            </motion.div>
          </div>

          {/* Row 2 - Reverse */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              variants={createMarqueeVariants('reverse')}
              animate={reverseControls}
              style={{ width: 'max-content' }}
            >
              {duplicatedLogos.map((logo, idx) => (
                <TechLogoItem key={`reverse-${idx}`} logo={logo} isHovered={isHovered} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </SectionWrapper>
  )
}

