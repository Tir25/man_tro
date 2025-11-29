"use client"

import { motion } from "framer-motion"
import type { ComponentType } from "react"
import { useDecryption } from "@/hooks/useDecryption"
import { useSoundSafe } from "@/hooks/useSoundSafe"

type IconComponent = ComponentType<{ className?: string }>

export interface DecryptionLinkProps {
  label: string
  href: string
  icon: IconComponent
  accentClassName?: string
  'aria-label'?: string
  className?: string
}

export function DecryptionLink({
  label,
  href,
  icon: Icon,
  accentClassName = "text-cyan-400",
  'aria-label': ariaLabel,
  className = "",
}: DecryptionLinkProps) {
  const targetText = label.toUpperCase()
  const { displayText, isDecrypting, startDecryption, reset } = useDecryption(
    targetText
  )

  // Safely load sound file, gracefully handles missing file
  const [playGlitch] = useSoundSafe("/sounds/glitch-decrypt.mp3", {
    volume: 0.35,
    interrupt: true,
  })

  const isDecrypted = displayText === targetText && !isDecrypting

  const handleMouseEnter = () => {
    // Try to play sound if available, ignore errors
    if (playGlitch) {
      try {
        playGlitch()
      } catch {
        // Silently ignore playback errors
      }
    }
    startDecryption()
  }

  const handleMouseLeave = () => {
    reset()
  }

  return (
    <motion.a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel || label}
      className={`group relative flex w-full items-center justify-between overflow-hidden rounded-lg border border-white/10 bg-white/5 px-6 py-4 text-xs tracking-[0.25em] text-white/40 transition-all hover:border-white/20 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] ${className}`}
      style={{
        textTransform: "uppercase",
        letterSpacing: "0.25em",
      }}
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.08)",
      }}
    >
      <span className="relative font-mono">
        <span
          className={`block transition-colors duration-150 ${isDecrypted ? accentClassName : "text-white/40"
            }`}
        >
          {displayText}
        </span>
      </span>

      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={
          isDecrypted
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: -10 }
        }
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
        }}
        className={`pointer-events-none ${accentClassName}`}
      >
        <Icon className="h-5 w-5" />
      </motion.span>
    </motion.a>
  )
}


