/**
 * Shared TypeScript types and interfaces for the Mantro application
 */

// Project types
export type { Project, ProjectSize } from '@/lib/projects'

// Animation state types
export interface AnimationState {
  isAnimating: boolean
  progress: number
}

// Form types
export interface ContactFormValues {
  name: string
  email: string
  company?: string
  projectType?: string
  message: string
}

// Service types
export interface Service {
  title: string
  description: string
  icon: string
  image?: string // Optional image path for the service
}

// Work/Portfolio types
export interface WorkProject {
  id: number
  title: string
  category: string
  image: string
  url: string
}

// Component prop types
export interface ComponentWithClassName {
  className?: string
}

// Navigation types
export interface NavItem {
  label: string
  href: string
}

// Social link types
export interface SocialLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  accentClassName?: string
}

