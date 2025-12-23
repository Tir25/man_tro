'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'
import { useMouse } from '@/hooks/useMouse'
import { transition as smoothTransition } from '@/src/lib/smooth-motion'

interface ProjectCardProps {
  project: Project
  onHover: (color: string | null) => void
  delay?: number
}

const sizeClassMap: Record<Project['size'], string> = {
  small: 'min-h-[320px]',
  medium: 'min-h-[420px]',
  large: 'min-h-[540px]',
}

export function ProjectCard({ project, onHover, delay = 0 }: ProjectCardProps) {
  const { ref, progressX, progressY } = useMouse<HTMLDivElement>()
  const rotateX = progressY * -10
  const rotateY = progressX * 10

  // Handle card click for navigation (avoids nested anchor issue)
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the source button
    if ((e.target as HTMLElement).closest('a[data-source-link]')) {
      return
    }
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.article
      ref={ref}
      className={cn(
        'group relative isolate rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl transition-shadow duration-500 will-change-transform',
        'hover:border-white/30 hover:shadow-[0_25px_80px_rgba(0,0,0,0.35)]',
        project.url && 'cursor-pointer',
        sizeClassMap[project.size]
      )}
      style={{
        perspective: '1000px',
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay }}
      onMouseEnter={() => onHover(project.dominantColor)}
      onMouseLeave={() => onHover(null)}
      onClick={handleCardClick}
      role={project.url ? 'link' : undefined}
      tabIndex={project.url ? 0 : undefined}
      onKeyDown={(e) => {
        if (project.url && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          window.open(project.url, '_blank', 'noopener,noreferrer')
        }
      }}
    >
      <div className="block h-full">
        <motion.div
          className="flex h-full flex-col overflow-hidden rounded-[26px] bg-obsidian/80 will-change-transform"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
          transition={smoothTransition}
        >
          <div className="relative h-64 overflow-hidden">
            {project.video ? (
              <video
                src={project.video}
                poster={project.image.src}
                muted
                loop
                playsInline
                autoPlay
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            ) : (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                priority={false}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMzAzMDQiLz48L3N2Zz4="
                loading="lazy"
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 opacity-80"
              style={{ boxShadow: `inset 0 0 80px ${project.dominantColor}40` }}
            />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1 text-xs uppercase tracking-widest text-white/80">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.dominantColor }} />
              {project.category}
            </div>
            {/* External link indicator */}
            {project.url && (
              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ExternalLink className="h-4 w-4 text-white/80" />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Project</p>
              <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
              <p className="mt-2 text-sm text-white/70">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/5 pt-4 text-sm text-white/80">
              <div className="flex flex-wrap gap-4">
                {project.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-white/40">{stat.label}</span>
                    <span className="text-lg font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-source-link
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  Source
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[26px] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at top, ${project.dominantColor}40, transparent 55%)` }}
      />
    </motion.article>
  )
}

