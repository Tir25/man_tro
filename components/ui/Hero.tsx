'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Link from 'next/link'
import { Typography } from './Typography'
import { Button } from './Button'
import { MagneticButton } from './MagneticButton'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Lazy load the 3D scene
const HeroScene = dynamic(
    () => import('@/components/effects/HeroScene').then((mod) => mod.HeroScene),
    { 
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-neon-violet/20 to-electric-cyan/20 blur-3xl animate-pulse" />
            </div>
        )
    }
)

export function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background 3D Scene */}
            <div className="absolute inset-0 z-0">
                <ErrorBoundary
                    fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-neon-violet/20 to-electric-cyan/20 blur-3xl animate-pulse" />
                        </div>
                    }
                >
                    <Suspense
                        fallback={
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-neon-violet/20 to-electric-cyan/20 blur-3xl animate-pulse" />
                            </div>
                        }
                    >
                        <HeroScene className="w-full h-full" />
                    </Suspense>
                </ErrorBoundary>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Typography
                        variant="h1"
                        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                    >
                        MANTRO
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    <Typography
                        variant="h3"
                        className="text-xl md:text-2xl text-cyan mb-8 font-light tracking-widest uppercase"
                    >
                        Ethereal Industrialism
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    className="flex flex-col md:flex-row gap-4 justify-center items-center"
                >
                    <MagneticButton
                      className="min-w-[200px] px-8 py-4 text-lg"
                      onClick={() => {
                        window.location.href = '/#work'
                      }}
                    >
                      View Our Work
                    </MagneticButton>
                    <Button size="lg" variant="outline" className="min-w-[200px]" asChild>
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-cyan to-transparent" />
            </motion.div>
        </section>
    )
}
