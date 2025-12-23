/**
 * Particles Module - Barrel Export
 * Central entry point for all particle system utilities
 */

export { PARTICLE_CONFIG, PARTICLE_COLORS, type ParticleConfig } from './config'
export {
    generateSphere,
    generateCube,
    generateGalaxy,
    generateWave,
    SHAPE_GENERATORS,
    type ShapeGenerator
} from './shapes'
export { createVertexShader, createFragmentShader, createStarTexture } from './shaders'
