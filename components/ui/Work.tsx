'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Typography } from './Typography'
import { Button } from './Button'
import { SectionWrapper } from './SectionWrapper'
import { useProjectFilter } from '@/hooks/useProjectFilter'
import { cn } from '@/lib/utils'
import type { WorkProject } from '@/src/types'

const projects: WorkProject[] = [
    {
        id: 1,
        title: 'VR NextGEN Solutions',
        category: 'Consultancy Firm Website',
        image: '/work-vr-nextgen.png',
        url: 'https://vrnextgensolutions.com/',
    },
    {
        id: 2,
        title: 'UniTrack',
        category: 'Real-time Transit Tracking PWA',
        image: '/work-bus-tracker.png',
        url: 'https://university-bus-tracker-app.web.app/',
    },
    {
        id: 3,
        title: 'Rudri Dave – Portfolio & Blog',
        category: 'Portfolio & Blogging Site',
        image: '/work-rudri-portfolio.png',
        url: 'https://rudri-p-portfolio.vercel.app/',
    },
]

const categories = ['All', 'Consultancy', 'Web App', 'Portfolio']

export function Work() {
    const { activeCategory, setActiveCategory, filteredProjects } =
        useProjectFilter(projects, categories)

    return (
        <SectionWrapper id="work" className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <Typography variant="h2" className="mb-4">
                            Selected Works
                        </Typography>
                        <Typography variant="body" className="text-gray-400 max-w-xl">
                            A curated collection of our most ambitious projects, pushing the boundaries of digital expression.
                        </Typography>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={activeCategory === cat}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
                                    activeCategory === cat
                                        ? 'bg-cyber-violet border-cyber-violet text-white'
                                        : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.a
                                key={project.id}
                                href={project.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label={`View project: ${project.title}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                layout
                                className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer"
                            >
                                {/* Project image */}
                                <div className="w-full h-full overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        fill
                                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                        placeholder="blur"
                                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMzAzMDQiLz48L3N2Zz4="
                                        loading="lazy"
                                    />
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <Typography
                                        variant="h4"
                                        className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        {project.title}
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        className="text-cyan text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                                    >
                                        {project.category}
                                    </Typography>
                                </div>
                            </motion.a>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <div className="mt-16 text-center">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/projects">View All Projects</Link>
                    </Button>
                </div>
            </div>
        </SectionWrapper>
    )
}
