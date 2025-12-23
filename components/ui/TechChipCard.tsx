'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TechChip } from '@/lib/techStackData'

interface TechChipCardProps {
    tech: TechChip
    isHovered: boolean
}

/**
 * Individual tech chip card with hover effects and icon display
 */
export const TechChipCard = memo(function TechChipCard({ tech, isHovered }: TechChipCardProps) {
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
