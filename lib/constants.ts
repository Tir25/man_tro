/**
 * Design tokens for Mantro
 * Ethereal Industrialism theme
 */

export const colors = {
  void: '#030304',
  'cyber-violet': '#7B2CBF',
  cyan: '#4CC9F0',
} as const

export const theme = {
  colors,
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const
