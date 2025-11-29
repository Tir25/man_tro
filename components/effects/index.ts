// Barrel file for effects components
// These components are heavy and should be lazy-loaded

export { HeroScene } from './HeroScene'
export { MaskMagicHero } from './MaskMagicHero'
export { SmoothScroll } from './SmoothScroll'
export { WebGLScene } from './WebGLScene'

// ParticleBrain exports
// Note: Use default export for ParticleBrain due to forwardRef usage
// import ParticleBrain from '@/components/effects/ParticleBrain'
export type { ParticleBrainHandle } from './ParticleBrain'

