'use client'

import { useMemo, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ProjectCard } from '@/components/ui'
import { projects } from '@/lib/projects'
import { colors } from '@/lib/theme'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

const baseColor = colors.void

export default function ProjectsPage() {
  const [activeColor, setActiveColor] = useState<string>(baseColor)
  const { scrollYProgress } = useScroll()

  const columns = useMemo(() => {
    const columnCount = 3
    return projects.reduce<Array<typeof projects>>((acc, project, index) => {
      const columnIndex = index % columnCount
      acc[columnIndex] = acc[columnIndex] ?? []
      acc[columnIndex].push(project)
      return acc
    }, Array.from({ length: columnCount }, () => []))
  }, [])

  const columnParallax = [
    useTransform(scrollYProgress, [0, 1], [0, -120]),
    useTransform(scrollYProgress, [0, 1], [-60, -200]),
    useTransform(scrollYProgress, [0, 1], [0, -160]),
  ]

  const handleHover = (color: string | null) => {
    setActiveColor(color ?? baseColor)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-void text-white">
      <Header />
      <motion.div
        className="pointer-events-none fixed inset-0 -z-10 transition-colors duration-700"
        animate={{ backgroundColor: activeColor }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_45%)]" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-32 pt-16 md:px-8">
        <header className="max-w-4xl space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-white/50">Projects</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Real client launches across web, product, and storytelling.
          </h1>
          <p className="text-lg text-white/70 md:text-xl">
            From enterprise consultancy sites to realtime telemetry dashboards and editorial portfolios—every tile below is a shipped Mantro engagement. Hover any project to shift the ambient palette and inspect the stack that powered it.
          </p>
        </header>

        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-[40px] border border-white/5 bg-white/5 blur-3xl" />
          <div className="flex flex-col gap-8 md:flex-row">
            {columns.map((column, columnIndex) => (
              <motion.div
                key={`column-${columnIndex}`}
                className="flex flex-1 flex-col gap-8"
                style={{ y: columnParallax[columnIndex] }}
              >
                {column.map((project, projectIndex) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onHover={handleHover}
                    delay={(columnIndex * 0.08) + projectIndex * 0.04}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

