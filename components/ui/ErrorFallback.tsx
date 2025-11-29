'use client'

import { Button } from './Button'
import { Typography } from './Typography'
import { cn } from '@/lib/utils'

interface ErrorFallbackProps {
  error?: Error | null
  resetError?: () => void
  className?: string
}

/**
 * Standard error fallback component styled with Mantro aesthetic
 * Used within Error Boundaries to show polite messages when sections fail
 */
export function ErrorFallback({
  error,
  resetError,
  className,
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        'flex min-h-[400px] items-center justify-center rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl',
        className
      )}
    >
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-4">
          <svg
            className="h-8 w-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <Typography variant="h3" className="text-cyan">
          Something went wrong
        </Typography>
        <Typography variant="body" className="text-gray-400">
          {error?.message ||
            'An unexpected error occurred while loading this section.'}
        </Typography>
        {resetError && (
          <div className="pt-4">
            <Button onClick={resetError} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

