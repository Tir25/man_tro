'use client'

import { useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { Typography } from './Typography'
import { SectionWrapper } from './SectionWrapper'
import { HulyLazerCard } from './HulyLazerCard'
import { cn } from '@/lib/utils'
import type { Service } from '@/src/types'

const services: Service[] = [
    {
        title: 'Digital Strategy',
        description: 'We craft roadmaps for digital dominance, aligning technology with your boldest business goals.',
        icon: '01',
        image: '/digital-strategy-service.png',
    },
    {
        title: 'UI/UX Design',
        description: 'We craft roadmaps for digital dominance, aligning technology with your boldest business goals.',
        icon: '02',
        image: '/ui-ux-service.png',
    },
    {
        title: 'Web Development',
        description: 'We craft roadmaps for digital dominance, aligning technology with your boldest business goals.',
        icon: '03',
        image: '/web-development-service.png',
    },
    {
        title: 'Android Development',
        description: 'We craft roadmaps for digital dominance, aligning technology with your boldest business goals.',
        icon: '04',
        image: '/android-development-service.png',
    },
    {
        title: 'AI Agent Development',
        description: 'We craft roadmaps for digital dominance, aligning technology with your boldest business goals.',
        icon: '05',
        image: '/ai-agent-development-service.png',
    },
]

interface ServicesGridProps {
    className?: string
}

const ServiceCard = memo(({ service, index }: { service: Service; index: number }) => {
    const iconElement = useMemo(
        () => (
            <span className="font-mono text-2xl font-semibold text-white/80">
                {service.icon}
            </span>
        ),
        [service.icon]
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="h-full"
        >
            <HulyLazerCard
                className="h-full"
                title={service.title}
                description={service.description}
                icon={iconElement}
                image={service.image}
            />
        </motion.div>
    )
})

ServiceCard.displayName = 'ServiceCard'

export const ServicesGrid = memo(function ServicesGrid({ className }: ServicesGridProps) {
    const servicesArray = useMemo(() => services, [])

    return (
        <SectionWrapper
            id="services"
            className={cn(
                'relative overflow-hidden py-24 md:py-32',
                'before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
                className
            )}
        >
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <Typography variant="h2" className="mb-4 text-balance">
                        Precision Meets Dreaming
                    </Typography>
                    <Typography variant="body" className="mx-auto max-w-3xl text-gray-400">
                        Each engagement is treated like a bespoke artifact—equal parts research lab, art studio, and
                        high-velocity product squad. These are the disciplines we thread into every build.
                    </Typography>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {servicesArray.map((service, index) => (
                        <ServiceCard key={service.title} service={service} index={index} />
                    ))}
                </div>
            </div>
        </SectionWrapper>
    )
})
