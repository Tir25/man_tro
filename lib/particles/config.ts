/**
 * ParticleBrain Configuration
 * Centralized settings for the particle system including performance, animation, and interaction
 */
import * as THREE from 'three'

export const PARTICLE_CONFIG = {
    // Performance settings
    particleCount: 6000,
    shapeSize: 14,

    // Swarm/morphing settings
    swarmDistanceFactor: 1.5,
    swirlFactor: 4.0,
    noiseFrequency: 0.1,
    noiseTimeScale: 0.04,
    noiseMaxStrength: 2.8,
    morphDuration: 4000,

    // Particle appearance
    particleSizeRange: [0.12, 0.35] as [number, number],

    // Idle animation settings
    idleFlowStrength: 0.25,
    idleFlowSpeed: 0.08,
    idleRotationSpeed: 0.02,

    // Morph effect settings
    morphSizeFactor: 0.5,
    morphBrightnessFactor: 0.6,

    // Interaction settings
    interactionRadius: 8.0,
    interactionStrength: 2.5,
    interactionSmoothness: 0.15,
    interactionFadeSpeed: 0.05,
} as const

// Brand colors for particle gradient
export const PARTICLE_COLORS = {
    cyan: new THREE.Color('#4CC9F0'),
    violet: new THREE.Color('#7B2CBF'),
} as const

export type ParticleConfig = typeof PARTICLE_CONFIG
