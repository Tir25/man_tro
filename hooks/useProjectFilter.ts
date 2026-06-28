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

    const activeLower = activeCategory.toLowerCase();

    return projects.filter((project) => {
      const categoryLower = project.category.toLowerCase();
      
      if (activeLower === 'websites') {
        return (
          categoryLower.includes('website') || 
          categoryLower.includes('firm') || 
          categoryLower.includes('cafe') || 
          categoryLower.includes('consultancy')
        );
      }
      if (activeLower === 'web apps') {
        return categoryLower.includes('app') || categoryLower.includes('pwa');
      }
      
      return categoryLower.includes(activeLower);
    })
  }, [activeCategory, projects])

  return {
    activeCategory,
    setActiveCategory,
    filteredProjects,
  }
}

