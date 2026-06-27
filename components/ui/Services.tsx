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
        description: 'I analyze your business goals and craft a clear technical roadmap to ensure your project succeeds from day one.',
        icon: '01',
        image: '/digital-strategy-service.png',
    },
    {
        title: 'UI/UX Design',
        description: 'I design intuitive, premium interfaces that look beautiful and provide a seamless experience for your users.',
        icon: '02',
        image: '/ui-ux-service.png',
    },
    {
        title: 'Web Development',
        description: 'I build blazing-fast, scalable web applications using modern tech stacks like Next.js, React, and Tailwind.',
        icon: '03',
        image: '/web-development-service.png',
    },
    {
        title: 'Android Development',
        description: 'I develop robust and responsive Android applications tailored to perform flawlessly on any device.',
        icon: '04',
        image: '/android-development-service.png',
    },
    {
        title: 'AI Agent Development',
        description: 'I integrate cutting-edge AI capabilities into your products to automate tasks and create smarter user experiences.',
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
                        Each project is treated as a bespoke collaboration. I combine deep engineering expertise with clean design to bring your vision to life.
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
