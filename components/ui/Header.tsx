'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from './Button'
import { MantroLogo } from './MantroLogo'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/src/types'

interface HeaderProps {
  className?: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
]

export function Header({ className }: HeaderProps) {
  const isScrolled = useScrollPosition(50)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-optimized',
        isScrolled ? 'bg-void/90 backdrop-blur-sm py-4' : 'bg-transparent py-6',
        className
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <MantroLogo size={40} gradientId="mantro-logo-gradient" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const linkClasses =
              'text-sm font-medium text-gray-300 hover:text-cyan transition-colors relative group'

            const content = (
              <>
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan transition-all group-hover:w-full" />
              </>
            )

            return item.href.startsWith('/')
              ? (
                <Link key={item.label} href={item.href} className={linkClasses}>
                  {content}
                </Link>
              )
              : (
                <a key={item.label} href={item.href} className={linkClasses}>
                  {content}
                </a>
              )
          })}
          <Button size="sm" variant="primary" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={handleMobileMenuToggle}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={cn(
                'w-full h-0.5 bg-white transition-all',
                isMobileMenuOpen && 'rotate-45 translate-y-2'
              )}
            />
            <span
              className={cn(
                'w-full h-0.5 bg-white transition-all',
                isMobileMenuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'w-full h-0.5 bg-white transition-all',
                isMobileMenuOpen && '-rotate-45 -translate-y-2.5'
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-void/95 backdrop-blur-xl border-t border-white/10 p-4 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => {
                const linkClasses =
                  'text-lg font-medium text-gray-300 hover:text-cyan transition-colors'

                if (item.href.startsWith('/')) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={linkClasses}
                      onClick={handleMobileMenuClose}
                    >
                      {item.label}
                    </Link>
                  )
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={linkClasses}
                    onClick={handleMobileMenuClose}
                  >
                    {item.label}
                  </a>
                )
              })}
              <Button className="w-full" variant="primary" asChild>
                <Link href="/contact">Contact</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
