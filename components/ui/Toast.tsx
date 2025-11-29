'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastProps {
  toast: Toast
  onDismiss: (id: string) => void
}

export function ToastItem({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id)
      }, toast.duration || 5000)

      return () => clearTimeout(timer)
    }

    return undefined
  }, [toast.id, toast.duration, onDismiss])

  const typeStyles = {
    success: {
      bg: 'bg-cyan/10 border-cyan/30',
      text: 'text-cyan',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      text: 'text-red-400',
      icon: '✕',
    },
    info: {
      bg: 'bg-white/5 border-white/20',
      text: 'text-white/80',
      icon: 'ℹ',
    },
  }

  const styles = typeStyles[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        'relative flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_0_40px_rgba(76,201,240,0.15)] backdrop-blur-xl',
        styles.bg,
      )}
    >
      <span className={cn('text-sm font-medium', styles.text)}>
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          'ml-auto flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-white/10',
          styles.text,
        )}
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex flex-col gap-2 sm:top-6 sm:right-6">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

