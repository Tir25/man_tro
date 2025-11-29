'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className,
      type = 'button',
      disabled = false,
      asChild = false,
      ...rest
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary: 'bg-cyber-violet text-white hover:bg-cyber-violet/90 focus:ring-cyber-violet',
      secondary: 'bg-electric-cyan text-void hover:bg-electric-cyan/90 focus:ring-electric-cyan',
      outline:
        'border-2 border-cyber-violet text-cyber-violet hover:bg-cyber-violet/10 focus:ring-cyber-violet',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    const Component = asChild ? Slot : 'button'

    return (
      <Component
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(!asChild && { type, disabled })}
        {...rest}
        ref={ref}
        suppressHydrationWarning
      >
        {children}
      </Component>
    )
  },
)

Button.displayName = 'Button'
