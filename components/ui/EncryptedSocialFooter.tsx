"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { DecryptionLink } from "./DecryptionLink"

const LINKS = [
  {
    label: "X / Twitter",
    href: "#",
    icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "#",
    icon: Github,
  },
  {
    label: "Instagram",
    href: "#",
    icon: Instagram,
  },
] as const

export function EncryptedSocialFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(76,201,240,0.3),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(123,44,191,0.25),transparent_55%)] opacity-60 blur-3xl" />

      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6 md:px-10">
        <div className="hidden text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 md:block">
          <span className="inline-flex items-center gap-2">
            <span className="h-[1px] w-5 bg-cyan-400/60" />
            Mantro / Encrypted Social Uplink
          </span>
        </div>

        <motion.div
          className="flex w-full flex-wrap items-center justify-center gap-4 md:w-auto md:justify-end"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {LINKS.map((link) => (
            <DecryptionLink
              key={link.label}
              label={link.label}
              href={link.href}
              icon={link.icon}
            />
          ))}
        </motion.div>
      </div>
    </footer>
  )
}


