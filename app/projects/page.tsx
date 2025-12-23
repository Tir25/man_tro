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
 * Mobile optimized with better touch targets and readable text
 */
function FeaturedProject({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-white/5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background Image - taller on mobile for better content visibility */}
      <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        {project.video ? (
          <video
            src={project.video}
            poster={project.image.src}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}

        {/* Gradient Overlay - stronger on mobile for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 sm:via-black/50 sm:to-transparent" />
        <div
          className="absolute inset-0 opacity-20 sm:opacity-30"
          style={{ background: `radial-gradient(circle at 50% 100%, ${project.dominantColor}60, transparent 50%)` }}
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12">
        {/* Category Badge */}
        <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-white/90"
          >
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full animate-pulse" style={{ backgroundColor: project.dominantColor }} />
            {project.category}
          </span>
          <span className="text-[10px] sm:text-xs text-white/50">Featured</span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight leading-tight">
          {project.title}
        </h2>
        <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
          {project.description}
        </p>

        {/* Tech Stack & Stats - Stacked on mobile */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6">
          {/* Tech pills - fewer on mobile */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/10 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-white/80"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] sm:text-xs text-white/50 self-center">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/60">
            {project.stats.map((stat) => (
              <span key={stat.label}>
                <span className="font-semibold text-white">{stat.value}</span>{' '}
                <span className="hidden sm:inline">{stat.label}</span>
                <span className="sm:hidden">{stat.label.slice(0, 3)}</span>
              </span>
            ))}
          </div>

          {/* Action Button - Full width on mobile */}
          <div className="sm:ml-auto mt-2 sm:mt-0">
            <span
              className="flex sm:inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 sm:px-5 py-2.5 sm:py-2 text-sm text-white w-full sm:w-auto"
            >
              View Project <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

/**
 * Compact Project Card for the grid
 * Mobile optimized with proper touch targets
 */
function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative block overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/5',
        'active:scale-[0.98] transition-transform duration-150' // Touch feedback
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Image - Consistent aspect ratio */}
      <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden">
        {project.video ? (
          <video
            src={project.video}
            poster={project.image.src}
            muted
            loop
            playsInline
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        )}

        {/* Overlay - Stronger for mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

        {/* Color accent on hover (desktop only) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 hidden sm:block"
          style={{ background: `radial-gradient(circle at center, ${project.dominantColor}40, transparent 70%)` }}
        />

        {/* External link icon - Always visible on mobile */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full border border-white/20 bg-black/50 p-1.5 sm:p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6">
        {/* Category */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.dominantColor }} />
          <span className="text-[10px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-white/60">{project.category}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white mb-2 text-lg sm:text-xl leading-tight">
          {project.title}
        </h3>

        {/* Description - Always show on mobile, truncated */}
        <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Tech stack preview */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] text-white/70"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[9px] sm:text-[10px] text-white/50 self-center">+{project.technologies.length - 3}</span>
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
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_-20%,rgba(124,58,237,0.12),transparent_50%)] sm:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.15),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 pt-20 sm:pt-24 md:pt-32">
        {/* Hero Header - Mobile optimized */}
        <header className="mb-8 sm:mb-12 md:mb-16">
          <motion.p
            className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/50 mb-3 sm:mb-4"
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
            <Typography variant="h1" className="text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight mb-3 sm:mb-4">
              Crafting digital<br className="sm:hidden" /> experiences
              <span className="text-white/50 block sm:inline"> that resonate.</span>
            </Typography>
          </motion.div>
          <motion.p
            className="text-base sm:text-lg text-white/60 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From enterprise platforms to personal portfolios—each project is a testament to precision engineering and creative vision.
          </motion.p>
        </header>

        {/* Featured Project */}
        <section className="mb-8 sm:mb-12">
          <FeaturedProject project={featuredProject} />
        </section>

        {/* Projects Grid */}
        {gridProjects.length > 0 && (
          <section>
            <motion.h3
              className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/40 mb-4 sm:mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              More Projects
            </motion.h3>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
