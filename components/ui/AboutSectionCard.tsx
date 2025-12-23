'use client'

import { RefObject } from 'react'
import { motion } from 'framer-motion'

export interface AboutSection {
    id: string
    number: string
    label: string
    title: string
    description: string
}

export const ABOUT_SECTIONS: AboutSection[] = [
    {
        id: 'genesis',
        number: '01',
        label: 'THE GENESIS',
        title: 'The Genesis',
        description: 'A collective intelligence with no edges.',
    },
    {
        id: 'expansion',
        number: '02',
        label: 'THE EXPANSION',
        title: 'The Expansion',
        description: 'spiraling outwards into new possibilities.',
    },
    {
        id: 'flux',
        number: '03',
        label: 'THE FLUX',
        title: 'The Flux',
        description: 'Adapting to the frequency of the modern web.',
    },
    {
        id: 'foundation',
        number: '04',
        label: 'THE FOUNDATION',
        title: 'The Foundation',
        description: 'Structured, pixel-perfect engineering.',
    },
]

interface AboutSectionCardProps {
    section: AboutSection
    sectionRef?: RefObject<HTMLDivElement | null>
}

/**
 * Reusable section card for the About page scrollytelling sections
 */
export function AboutSectionCard({ section, sectionRef }: AboutSectionCardProps) {
    return (
        <section
            ref={sectionRef}
            className="flex min-h-[100vh] items-center justify-center px-4 py-10"
        >
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.5, once: false }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="mx-auto max-w-3xl"
            >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 px-8 py-10 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl sm:px-10 sm:py-12">
                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 opacity-40">
                        <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top,_rgba(76,201,240,0.45),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(123,44,191,0.55),_transparent_60%)]" />
                    </div>

                    {/* Content */}
                    <div className="relative space-y-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400/80">
                            {section.number} / {section.label}
                        </p>
                        <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                            {section.title}
                        </h2>
                        <p className="text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
                            {section.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
