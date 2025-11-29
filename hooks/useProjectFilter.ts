import { useMemo, useState } from 'react'
import type { WorkProject } from '@/src/types'

export interface ProjectFilter {
  activeCategory: string
  setActiveCategory: (category: string) => void
  filteredProjects: WorkProject[]
}

/**
 * Hook to manage project filtering logic
 */
export function useProjectFilter(
  projects: WorkProject[],
  _categories: string[]
): ProjectFilter {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') {
      return projects
    }

    return projects.filter((project) => {
      if (activeCategory === 'Consultancy') {
        return project.category.includes('Consultancy')
      }
      if (activeCategory === 'Web App') {
        return project.category.includes('Web App')
      }
      if (activeCategory === 'Portfolio') {
        return project.category.includes('Portfolio')
      }
      return true
    })
  }, [activeCategory, projects])

  return {
    activeCategory,
    setActiveCategory,
    filteredProjects,
  }
}

