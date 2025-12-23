'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, ArrowUpRight } from 'lucide-react'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { Typography } from '@/components/ui/Typography'
import { projects, Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

/**
 * Featured Project Hero - Large showcase for the main project
 */
function FeaturedProject({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Background Image */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        {project.video ? (
          <video
            src={project.video}
            poster={project.image.src}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
            priority
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 70% 80%, ${project.dominantColor}60, transparent 50%)` }}
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        {/* Category Badge */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm px-4 py-1.5 text-xs uppercase tracking-widest text-white/90"
          >
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: project.dominantColor }} />
            {project.category}
          </span>
          <span className="text-xs text-white/50">Featured</span>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          {project.title}
        </h2>
        <p className="text-white/70 text-base md:text-lg max-w-2xl mb-6">
          {project.description}
        </p>

        {/* Tech Stack & Stats */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-white/60">
            {project.stats.map((stat) => (
              <span key={stat.label}>
                <span className="font-semibold text-white">{stat.value}</span> {stat.label}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <motion.span
            className="ml-auto hidden md:flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white group-hover:bg-white group-hover:text-black transition-colors"
            whileHover={{ gap: 12 }}
          >
            View Project <ArrowUpRight className="h-4 w-4" />
          </motion.span>
        </div>
      </div>
    </motion.a>
  )
}

/**
 * Compact Project Card for the grid
 */
function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  const isLarge = index === 0

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm',
        'hover:border-white/30 transition-all duration-300',
        isLarge && 'md:col-span-2 md:row-span-2'
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Image */}
      <div className={cn('relative overflow-hidden', isLarge ? 'aspect-[4/3]' : 'aspect-video')}>
        {project.video ? (
          <video
            src={project.video}
            poster={project.image.src}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Color accent */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at center, ${project.dominantColor}40, transparent 70%)` }}
        />

        {/* External link icon */}
        <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/40 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.dominantColor }} />
          <span className="text-[10px] uppercase tracking-widest text-white/60">{project.category}</span>
        </div>

        {/* Title */}
        <h3 className={cn('font-semibold text-white mb-1', isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl')}>
          {project.title}
        </h3>

        {/* Description - only on larger cards */}
        {isLarge && (
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{project.description}</p>
        )}

        {/* Tech stack preview */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, isLarge ? 4 : 2).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/70"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (isLarge ? 4 : 2) && (
            <span className="text-[10px] text-white/50">+{project.technologies.length - (isLarge ? 4 : 2)}</span>
          )}
        </div>
      </div>
    </motion.a>
  )
}

export default function ProjectsPage() {
  // Get featured project and remaining projects
  const featuredProject = useMemo(() => projects.find(p => p.featured) || projects[0], [])
  const gridProjects = useMemo(() => projects.filter(p => p !== featuredProject), [featuredProject])

  return (
    <main className="relative min-h-screen bg-void text-white">
      <Header />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-void" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.15),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pb-24 pt-24 md:pt-32">
        {/* Hero Header */}
        <header className="mb-12 md:mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.5em] text-white/50 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Selected Work
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Typography variant="h1" className="text-4xl md:text-6xl font-semibold leading-tight mb-4">
              Crafting digital experiences<br className="hidden md:block" />
              <span className="text-white/50">that resonate.</span>
            </Typography>
          </motion.div>
          <motion.p
            className="text-lg text-white/60 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From enterprise platforms to personal portfolios—each project is a testament to precision engineering and creative vision.
          </motion.p>
        </header>

        {/* Featured Project */}
        <section className="mb-12">
          <FeaturedProject project={featuredProject} />
        </section>

        {/* Projects Grid - Bento Style */}
        {gridProjects.length > 0 && (
          <section>
            <motion.h3
              className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              More Projects
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gridProjects.map((project, index) => (
                <ProjectGridCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
