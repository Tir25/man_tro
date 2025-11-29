'use client'

import { useState, useMemo, useEffect, memo, useCallback, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Typography } from '@/components/ui/Typography'
import { cn } from '@/lib/utils'
import { isMobileDevice } from '@/lib/deviceDetection'

interface TechChip {
  name: string
  icon: React.ReactNode
  color: string
  category: 'frontend' | 'mobile' | 'backend'
}

// Real SVG logos for each technology
const frontendTechs: TechChip[] = [
  {
    name: 'React',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-60 12 12)" />
      </svg>
    ),
    color: '#61DAFB',
    category: 'frontend',
  },
  {
    name: 'Next.js',
    icon: (
      <svg viewBox="0 0 394 80" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
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
    category: 'frontend',
  },
  {
    name: 'HTML5',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.955-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#E34F26',
    category: 'frontend',
  },
  {
    name: 'CSS3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622h10.125l-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.955-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#1572B6',
    category: 'frontend',
  },
  {
    name: 'JavaScript',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.12c-.676.195-1.24.6-1.56 1.005-1.034 1.716-.772 4.246 1.125 5.34 1.125.705 2.595.915 3.99.51.195-.03.42-.105.585-.195.195-.135.27-.24.39-.42.12-.18.195-.405.24-.66.06-.315.03-.63-.03-.945l-.48.034c-.42.03-.81.165-1.14.405-.27.21-.495.48-.6.81-.12.39-.105.81.03 1.185.135.375.39.705.75.915.36.21.81.27 1.23.18.42-.09.81-.315 1.11-.615.3-.3.51-.675.63-1.095.12-.42.15-.87.09-1.32zm-8.955-1.35c-.195-.135-.33-.3-.42-.495-.09-.195-.12-.42-.09-.645.03-.225.12-.45.27-.63.15-.18.36-.315.6-.405.24-.09.51-.12.78-.09.27.03.525.12.75.27.225.15.405.36.525.615.12.255.18.54.18.825 0 .285-.06.57-.18.825-.12.255-.3.465-.525.615-.225.15-.48.24-.75.27-.27.03-.54 0-.78-.09-.24-.09-.45-.225-.6-.405-.15-.18-.24-.405-.27-.63-.03-.225 0-.45.09-.645.09-.195.225-.36.42-.495z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#F7DF1E',
    category: 'frontend',
  },
  {
    name: 'Tailwind',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#06B6D4',
    category: 'frontend',
  },
]

const mobileTechs: TechChip[] = [
  {
    name: 'Android',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1349 1.0989L4.8429 5.4467a.4161.4161 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.186.8531 12.4174.0117 14.0735c-.3194.6329-.1193 1.393.5136 1.7124.6329.3194 1.393.1193 1.7124-.5136.6966-1.3801 2.001-2.4023 3.5408-2.8508l-.7443 1.289a.5957.5957 0 00.5159.8926h13.2662a.5956.5956 0 00.5159-.8926l-.7443-1.289c1.5398.4485 2.8442 1.4707 3.5408 2.8508.3194.6329 1.0795.833 1.7124.5136.6329-.3194.833-1.0795.5136-1.7124-.8414-1.6561-2.6772-2.8865-5.0515-3.7521z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#3DDC84',
    category: 'mobile',
  },
  {
    name: 'Jetpack Compose',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#4285F4',
    category: 'mobile',
  },
  {
    name: 'Kotlin',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M1.63636 0L12 12.5455L22.3636 0H24L12 14.1818L0 0H1.63636ZM0 16.3636L12 30.5455L24 16.3636V24L12 38.1818L0 24V16.3636Z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#7F52FF',
    category: 'mobile',
  },
]

const backendTechs: TechChip[] = [
  {
    name: 'Node.js',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.213c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,5.971C2.99,6.022,2.936,6.116,2.936,6.213v11.517c0,0.097,0.054,0.191,0.139,0.242l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.883V6.434c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v11.798 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,20.07c-0.57,0.329-0.922,0.942-0.922,1.606 c0,1.02,0.828,1.765,1.848,1.765c0.321,0,0.642-0.084,0.923-0.247l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082 c0.557,0.32,1.3,0.32,1.848,0c0.557-0.324,0.923-0.942,0.923-1.606c0-0.664-0.366-1.277-0.922-1.606l-2.409-1.392 c-1.106,0.551-1.614,0.551-2.111,0.551c-1.658,0-2.602-0.996-2.602-2.745V6.434c0-0.141,0.114-0.253,0.256-0.253h1.108 c0.142,0,0.256,0.112,0.256,0.253v11.517c0,0.771,0.802,1.531,2.109,0.883l2.409-1.39c0.438-0.248,0.224-0.332,0.08-0.383 c-0.585-0.203-0.704-0.25-1.329-0.604c-0.065-0.037-0.151-0.023-0.218,0.017l-8.794,5.078C12.639,23.916,12.32,24,11.998,24z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#339933',
    category: 'backend',
  },
  {
    name: 'Python',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M14.38 2.58a2.49 2.49 0 0 0-1.77.73 2.6 2.6 0 0 0-.73 1.78v1.28H5.58a2.49 2.49 0 0 0-1.77.73 2.6 2.6 0 0 0-.73 1.78v3.83a2.6 2.6 0 0 0 .4 1.34 2.49 2.49 0 0 0 1.1.99c.26.1.53.15.8.15h.7v-1.1a3.32 3.32 0 0 1 3.3-3.3h3.95a1.66 1.66 0 0 0 1.66-1.65V5.09a2.6 2.6 0 0 0-.73-1.78 2.49 2.49 0 0 0-1.78-.73zm.72 1.43a.83.83 0 0 1 .83.83.83.83 0 0 1-.83.83.83.83 0 0 1-.83-.83.83.83 0 0 1 .83-.83z"
          fill="currentColor"
        />
        <path
          d="M9.62 21.42a2.49 2.49 0 0 0 1.77-.73 2.6 2.6 0 0 0 .73-1.78v-1.28h6.3a2.49 2.49 0 0 0 1.77-.73 2.6 2.6 0 0 0 .73-1.78v-3.83a2.6 2.6 0 0 0-.4-1.34 2.49 2.49 0 0 0-1.1-.99 2.47 2.47 0 0 0-.8-.15h-.7v1.1a3.32 3.32 0 0 1-3.3 3.3H9.27a1.66 1.66 0 0 0-1.66 1.65v2.47a2.6 2.6 0 0 0 .73 1.78 2.49 2.49 0 0 0 1.78.73zm-.72-1.43a.83.83 0 0 1-.83-.83.83.83 0 0 1 .83-.83.83.83 0 0 1 .83.83.83.83 0 0 1-.83.83z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#3776AB',
    category: 'backend',
  },
  {
    name: 'PHP',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M8.5 8.5h1.5c.5 0 .9.4.9.9v5.2c0 .5-.4.9-.9.9H8.5c-.5 0-.9-.4-.9-.9V9.4c0-.5.4-.9.9-.9zm.9 1.8v3.6h.6v-3.6h-.6zm3.6-1.8h1.5c.5 0 .9.4.9.9v5.2c0 .5-.4.9-.9.9h-1.5c-.5 0-.9-.4-.9-.9V9.4c0-.5.4-.9.9-.9zm.9 1.8v3.6h.6v-3.6h-.6z"
          fill="currentColor"
        />
        <path
          d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#777BB4',
    category: 'backend',
  },
  {
    name: 'Supabase',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" preserveAspectRatio="xMidYMid meet">
        <path
          d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"
          fill="currentColor"
        />
      </svg>
    ),
    color: '#3ECF8E',
    category: 'backend',
  },
]

// Combine frontend and mobile for top track
const topTrackTechs = [...frontendTechs, ...mobileTechs]
const bottomTrackTechs = backendTechs

// Duplicate for seamless loop - optimized to reduce array operations
const duplicateArray = <T,>(arr: T[], times: number = 2): T[] => {
  if (times === 1) return arr
  const result: T[] = []
  for (let i = 0; i < times; i++) {
    result.push(...arr)
  }
  return result
}

// Memoize variant creators to prevent recreation on each render
const createMarqueeVariants = (direction: 'forward' | 'reverse', distance: number = 1000) => ({
  animate: {
    x: direction === 'forward' ? [0, -distance] : [-distance, 0],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: 30,
        ease: 'linear',
      },
    },
  },
})

interface TechChipCardProps {
  tech: TechChip
  isHovered: boolean
}

const TechChipCard = memo(function TechChipCard({ tech, isHovered }: TechChipCardProps) {
  const iconStyle = useMemo(
    () => ({
      color: isHovered ? tech.color : 'currentColor',
    }),
    [isHovered, tech.color]
  )

  return (
    <motion.div
      className={cn(
        'group relative flex items-center gap-3',
        'px-4 py-2.5',
        'bg-white/5 border border-white/10',
        'opacity-60',
        'transition-all duration-300',
        'hover:opacity-100',
        'hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(76,201,240,0.3)]',
        'will-change-transform'
      )}
      style={{
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
      }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 transition-all duration-300',
          isHovered ? 'grayscale-0' : 'grayscale'
        )}
        style={iconStyle}
      >
        {tech.icon}
      </div>
      {/* Name */}
      <span className="font-mono text-xs text-white/80 group-hover:text-white transition-colors">
        {tech.name}
      </span>
    </motion.div>
  )
})

TechChipCard.displayName = 'TechChipCard'

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

  // Optimize duplication - reduce on mobile for better performance
  const duplicationCount = isMobile ? 2 : 3
  const duplicatedTop = useMemo(
    () => duplicateArray(topTrackTechs, duplicationCount),
    [duplicationCount]
  )
  const duplicatedBottom = useMemo(
    () => duplicateArray(bottomTrackTechs, duplicationCount),
    [duplicationCount]
  )

  // Memoize variant creators
  const topVariants = useMemo(
    () => createMarqueeVariants('forward', isMobile ? 800 : 1200),
    [isMobile]
  )
  const bottomVariants = useMemo(
    () => createMarqueeVariants('reverse', isMobile ? 600 : 800),
    [isMobile]
  )

  const isVisible = inView

  // Start animations on mount and when visible
  useEffect(() => {
    if (isVisible) {
      topControls.start('animate')
      bottomControls.start('animate')
    } else {
      topControls.stop()
      bottomControls.stop()
    }
  }, [isVisible, topControls, bottomControls])

  // Optimized event handlers with useCallback
  const handleTopEnter = useCallback(() => {
    setIsTopHovered(true)
    topControls.stop()
  }, [topControls])

  const handleTopLeave = useCallback(() => {
    setIsTopHovered(false)
    if (isVisible) {
      topControls.start('animate')
    }
  }, [topControls, isVisible])

  const handleBottomEnter = useCallback(() => {
    setIsBottomHovered(true)
    bottomControls.stop()
  }, [bottomControls])

  const handleBottomLeave = useCallback(() => {
    setIsBottomHovered(false)
    if (isVisible) {
      bottomControls.start('animate')
    }
  }, [bottomControls, isVisible])

  return (
    <SectionWrapper
      id="tech-stack"
      className={cn(
        'relative overflow-hidden py-24 md:py-32',
        'bg-void',
        // Grid pattern background - optimized with will-change
        'before:absolute before:inset-0 before:opacity-5',
        'before:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]',
        'before:bg-[size:40px_40px]',
        'before:pointer-events-none',
        'before:will-change-auto',
        className
      )}
    >
      <div ref={containerRef} className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="mb-16 text-center">
          <Typography variant="h2" className="mb-4 text-balance">
            Precision Meets Dreaming
          </Typography>
          <Typography variant="body" className="mx-auto max-w-3xl text-gray-400">
            The technologies that power our digital experiences. Hover to illuminate.
          </Typography>
        </div>

        {/* Track 1 - Frontend & Mobile (Top) */}
        <div
          className="relative mb-8 overflow-hidden"
          onMouseEnter={handleTopEnter}
          onMouseLeave={handleTopLeave}
        >
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

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
        </div>

        {/* Energy Line Divider */}
        <div className="relative h-px bg-white/10 mb-8 overflow-hidden">
          {/* Glowing bead - only animate when visible */}
          {isVisible && (
            <motion.div
              className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent will-change-transform"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                repeat: Infinity,
                duration: isMobile ? 4 : 3,
                ease: 'linear',
              }}
            />
          )}
          {/* Static glow line */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>

        {/* Track 2 - Backend & Core (Bottom) */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={handleBottomEnter}
          onMouseLeave={handleBottomLeave}
        >
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />
          <motion.div
            className="flex gap-4 will-change-transform"
            variants={bottomVariants}
            animate={bottomControls}
            style={{ width: 'max-content' }}
          >
            {duplicatedBottom.map((tech, idx) => (
              <TechChipCard
                key={`bottom-${tech.name}-${idx}`}
                tech={tech}
                isHovered={isBottomHovered}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
})

TechStackEngine.displayName = 'TechStackEngine'

