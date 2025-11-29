'use client'

import { motion } from 'framer-motion'

export function HulyLaserBackground() {
    return (
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[#030304]">
      {/* Slow nebula glow in bottom-right */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-20%] right-[-10%] h-[420px] w-[420px] rounded-[999px] bg-[radial-gradient(circle_at_30%_0%,#4CC9F0_0,#4CC9F000_60%),radial-gradient(circle_at_80%_80%,#7B2CBF_0,#7B2CBF00_70%)] blur-3xl opacity-60"
        initial={{ opacity: 0, scale: 0.8, x: 40, y: 40 }}
        animate={{ opacity: 0.9, scale: 1, x: 0, y: 0 }}
        transition={{
          duration: 2.8,
          ease: [0.22, 0.61, 0.36, 1],
        }}
      />

      {/* Very subtle breathing drift */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-30%] right-[-5%] h-[520px] w-[520px] rounded-[999px] bg-[radial-gradient(circle_at_10%_0%,#4CC9F033_0,#4CC9F000_60%),radial-gradient(circle_at_80%_90%,#7B2CBF33_0,#7B2CBF00_70%)] blur-[90px] opacity-70"
        initial={{ scale: 0.95, rotate: 0 }}
        animate={{ scale: 1.05, rotate: 6 }}
        transition={{
          duration: 26,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />

      {/* Grain / noise overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Soft vignette to keep focus on the grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.75),transparent_60%)]"
      />
        </div>
    )
}

