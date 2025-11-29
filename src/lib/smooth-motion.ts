type SpringConfig = {
  type: 'spring'
  stiffness: number
  damping: number
  mass: number
}

export const transition: SpringConfig = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1,
}

