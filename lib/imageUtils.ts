/**
 * Utility functions for image optimization
 * Generates blur data URLs for placeholder images
 */

/**
 * Generate a simple blur data URL for placeholder images
 * This is a 1x1 pixel transparent PNG encoded as base64
 */
export function generateBlurDataURL(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMzAzMDQiLz48L3N2Zz4='
}

/**
 * Generate a blur data URL with custom color
 */
export function generateColoredBlurDataURL(color: string = '#030304'): string {
  const svg = `<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

