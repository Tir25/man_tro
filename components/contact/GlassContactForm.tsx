'use client'

import { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContactForm } from '@/hooks/useContactForm'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1],
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function GlassContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit,
    submitted,
  } = useContactForm()

  // Explicit form submission handler to ensure prevention of default behavior
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleSubmit(onSubmit)(e)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-[0_0_80px_rgba(76,201,240,0.18)] backdrop-blur-2xl sm:px-8 sm:py-8 md:px-9 md:py-9"
    >
      <div className="pointer-events-none absolute inset-[1px] rounded-[22px] border border-white/5" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-40" />

      <form
        onSubmit={handleFormSubmit}
        method="POST"
        className="relative space-y-6"
      >
        <motion.div variants={itemVariants} className="space-y-1.5">
          <label className="text-xs uppercase tracking-[0.22em] text-white/55">
            Name
          </label>
          <div
            className={cn(
              'group relative border-b border-white/20 pb-1 transition-colors',
              errors.name && 'border-cyan/60',
            )}
          >
            <input
              {...register('name')}
              type="text"
              autoComplete="name"
              className="peer w-full border-none bg-transparent px-0 py-1 text-sm text-white placeholder:text-white/30 outline-none focus:ring-0"
              placeholder="Alex Doe"
            />
            <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-[radial-gradient(circle_at_0%_0%,#4CC9F0,transparent_55%),radial-gradient(circle_at_100%_0%,#7B2CBF,transparent_55%)] transition-all duration-300 peer-focus:w-full" />
          </div>
          {errors.name && (
            <p className="text-[11px] text-cyan/80">{errors.name.message}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1.5">
          <label className="text-xs uppercase tracking-[0.22em] text-white/55">
            Email
          </label>
          <div
            className={cn(
              'group relative border-b border-white/20 pb-1 transition-colors',
              errors.email && 'border-cyan/60',
            )}
          >
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className="peer w-full border-none bg-transparent px-0 py-1 text-sm text-white placeholder:text-white/30 outline-none focus:ring-0"
              placeholder="you@company.com"
            />
            <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-[radial-gradient(circle_at_0%_0%,#4CC9F0,transparent_55%),radial-gradient(circle_at_100%_0%,#7B2CBF,transparent_55%)] transition-all duration-300 peer-focus:w-full" />
          </div>
          {errors.email && (
            <p className="text-[11px] text-cyan/80">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:gap-5"
        >
          <div className="flex-1 space-y-1.5">
            <label className="text-xs uppercase tracking-[0.22em] text-white/55">
              Company
            </label>
            <div className="group relative border-b border-white/20 pb-1">
              <input
                {...register('company')}
                type="text"
                className="peer w-full border-none bg-transparent px-0 py-1 text-sm text-white placeholder:text-white/30 outline-none focus:ring-0"
                placeholder="Optional"
              />
              <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-[radial-gradient(circle_at_0%_0%,#4CC9F0,transparent_55%),radial-gradient(circle_at_100%_0%,#7B2CBF,transparent_55%)] transition-all duration-300 peer-focus:w-full" />
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-xs uppercase tracking-[0.22em] text-white/55">
              Project
            </label>
            <div className="group relative border-b border-white/20 pb-1">
              <input
                {...register('projectType')}
                type="text"
                className="peer w-full border-none bg-transparent px-0 py-1 text-sm text-white placeholder:text-white/30 outline-none focus:ring-0"
                placeholder="Website, product, brand..."
              />
              <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-[radial-gradient(circle_at_0%_0%,#4CC9F0,transparent_55%),radial-gradient(circle_at_100%_0%,#7B2CBF,transparent_55%)] transition-all duration-300 peer-focus:w-full" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1.5">
          <label className="text-xs uppercase tracking-[0.22em] text-white/55">
            Project Outline
          </label>
          <div
            className={cn(
              'group relative border-b border-white/20 pb-1 transition-colors',
              errors.message && 'border-cyan/60',
            )}
          >
            <textarea
              {...register('message')}
              rows={4}
              className="peer w-full resize-none border-none bg-transparent px-0 py-1 text-sm text-white placeholder:text-white/30 outline-none focus:ring-0"
              placeholder="Share goals, timelines, and any links you'd like us to review."
            />
            <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-[radial-gradient(circle_at_0%_0%,#4CC9F0,transparent_55%),radial-gradient(circle_at_100%_0%,#7B2CBF,transparent_55%)] transition-all duration-300 peer-focus:w-full" />
          </div>
          {errors.message && (
            <p className="text-[11px] text-cyan/80">{errors.message.message}</p>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between pt-2"
        >
          <p className="text-[11px] text-white/40">
            We reply within <span className="text-white/70">24 hours</span>.
          </p>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/25 px-5 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/80 transition-colors disabled:cursor-not-allowed disabled:opacity-60',
            )}
            whileHover={{ y: -1.5, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(76,201,240,0.28),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(123,44,191,0.32),transparent_55%)] opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />

            <span className="relative">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </span>

            <AnimatePresence>
              {submitted && (
                <motion.span
                  key="check"
                  initial={{ scale: 0.6, opacity: 0, y: 6 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.6, opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="relative flex h-4 w-4 items-center justify-center rounded-full bg-cyan/80 text-[10px] text-[#030304] shadow-[0_0_20px_rgba(76,201,240,0.75)]"
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}


