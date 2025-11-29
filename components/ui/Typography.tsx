import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface TypographyProps {
  children: ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption'
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  color?: 'default' | 'cyan' | 'violet' | 'muted'
}

export function Typography({
  children,
  variant = 'body',
  className,
  as,
  color = 'default',
}: TypographyProps): ReactNode {
  const variants = {
    h1: 'text-6xl font-bold tracking-tight',
    h2: 'text-5xl font-bold tracking-tight',
    h3: 'text-4xl font-semibold tracking-tight',
    h4: 'text-3xl font-semibold',
    body: 'text-base leading-relaxed',
    small: 'text-sm',
    caption: 'text-xs text-gray-400',
  }

  const colors = {
    default: 'text-white',
    cyan: 'text-cyan',
    violet: 'text-cyber-violet',
    muted: 'text-gray-400',
  }

  const Component = as || (variant.startsWith('h') ? variant : 'p')

  return (
    <Component className={cn(variants[variant], colors[color], className)}>
      {children}
    </Component>
  )
}
