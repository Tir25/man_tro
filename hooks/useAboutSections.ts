'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useScroll } from 'framer-motion'

/**
 * Custom hook for managing scroll-based shape morphing on the About page
 * Tracks which section is most in view and triggers shape transitions
 */
export function useAboutSections(
    morphToShape: ((index: number) => void) | undefined
) {
    // Section refs
    const genesisRef = useRef<HTMLDivElement | null>(null)
    const expansionRef = useRef<HTMLDivElement | null>(null)
    const fluxRef = useRef<HTMLDivElement | null>(null)
    const foundationRef = useRef<HTMLDivElement | null>(null)

    // Track the last active shape to prevent unnecessary morphs
    const lastActiveShapeRef = useRef<number | null>(null)

    // Track scroll progress for each section
    const genesisProgress = useScroll({
        target: genesisRef,
        offset: ['start end', 'end start'],
    }).scrollYProgress

    const expansionProgress = useScroll({
        target: expansionRef,
        offset: ['start end', 'end start'],
    }).scrollYProgress

    const fluxProgress = useScroll({
        target: fluxRef,
        offset: ['start end', 'end start'],
    }).scrollYProgress

    const foundationProgress = useScroll({
        target: foundationRef,
        offset: ['start end', 'end start'],
    }).scrollYProgress

    // Determine which section is most in view
    const determineActiveShape = useCallback(() => {
        const progressValues = [
            genesisProgress.get(),
            expansionProgress.get(),
            fluxProgress.get(),
            foundationProgress.get(),
        ]

        let bestScore = -1
        let activeIndex = 0

        progressValues.forEach((progress, index) => {
            if (progress >= 0 && progress <= 1) {
                const distanceFromCenter = Math.abs(progress - 0.5)
                const score = 1 - distanceFromCenter

                if (score > bestScore) {
                    bestScore = score
                    activeIndex = index
                }
            }
        })

        // Fallback if no section is in view
        if (bestScore < 0) {
            for (let i = 0; i < progressValues.length; i++) {
                if (progressValues[i] > 0) {
                    activeIndex = i
                    break
                }
            }
        }

        return activeIndex
    }, [genesisProgress, expansionProgress, fluxProgress, foundationProgress])

    // Update shape when scroll changes
    useEffect(() => {
        const updateShape = () => {
            const activeIndex = determineActiveShape()

            if (lastActiveShapeRef.current !== activeIndex) {
                lastActiveShapeRef.current = activeIndex
                morphToShape?.(activeIndex)
            }
        }

        const unsubscribes = [
            genesisProgress.on('change', updateShape),
            expansionProgress.on('change', updateShape),
            fluxProgress.on('change', updateShape),
            foundationProgress.on('change', updateShape),
        ]

        // Initial morph
        const timeoutId = setTimeout(() => {
            lastActiveShapeRef.current = 0
            morphToShape?.(0)
        }, 200)

        return () => {
            clearTimeout(timeoutId)
            unsubscribes.forEach((unsub) => unsub())
        }
    }, [genesisProgress, expansionProgress, fluxProgress, foundationProgress, determineActiveShape, morphToShape])

    return {
        sectionRefs: {
            genesisRef,
            expansionRef,
            fluxRef,
            foundationRef,
        },
    }
}
