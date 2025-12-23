'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TechChip } from '@/lib/techStackData'

interface TechChipCardProps {
    tech: TechChip
    isHovered: boolean
    compact?: boolean // Mobile-friendly compact mode
}

/**
 * Individual tech chip card with hover effects and icon display
 * Supports compact mode for mobile devices
 */
export const TechChipCard = memo(function TechChipCard({ tech, isHovered, compact = false }: TechChipCardProps) {
    const iconStyle = useMemo(
        () => ({
            color: isHovered ? tech.color : 'currentColor',
        }),
        [isHovered, tech.color]
    )

    if (compact) {
        // Mobile compact version - no animations, smaller size
        return (
            <div
                className={cn(
                    'flex items-center gap-2',
                    'px-3 py-2',
                    'bg-white/5 border border-white/10',
                    'opacity-80',
                    'flex-shrink-0'
                )}
                style={{
                    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                }}
            >
                {/* Icon - smaller on mobile */}
                <div className="flex-shrink-0 w-4 h-4" style={{ color: tech.color }}>
                    {tech.icon}
                </div>
                {/* Name */}
                <span className="font-mono text-[10px] text-white/80 whitespace-nowrap">
                    {tech.name}
                </span>
            </div>
        )
    }

    // Desktop version with animations
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
