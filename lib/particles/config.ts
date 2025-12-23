/**
 * ParticleBrain Configuration
 * Centralized settings for the particle system including performance, animation, and interaction
 */
import * as THREE from 'three'

export const PARTICLE_CONFIG = {
    // Performance settings
    particleCount: 8000,  // Increased for denser effect
    shapeSize: 14,

    // Swarm/morphing settings
    swarmDistanceFactor: 1.8,  // Slightly more spread during morph
    swirlFactor: 5.0,          // More dramatic swirl
    noiseFrequency: 0.12,      // Slightly more complex noise
    noiseTimeScale: 0.05,      // Slightly faster noise evolution
    noiseMaxStrength: 3.2,     // Stronger displacement
    morphDuration: 3500,       // Slightly faster morphs for snappier feel

    // Particle appearance - varied sizes for depth
    particleSizeRange: [0.08, 0.45] as [number, number],  // Wider range for variety

    // Idle animation settings
    idleFlowStrength: 0.35,    // More noticeable idle motion
    idleFlowSpeed: 0.10,       // Slightly faster flow
    idleRotationSpeed: 0.025,  // Gentle rotation

    // Morph effect settings
    morphSizeFactor: 0.4,      // Less shrinking during morph
    morphBrightnessFactor: 0.8, // More glow during morph

    // Interaction settings
    interactionRadius: 10.0,   // Larger interaction area
    interactionStrength: 3.5,  // Stronger push effect
    interactionSmoothness: 0.18,
    interactionFadeSpeed: 0.04,
} as const

// Enhanced brand colors for particle gradient - more vibrant
export const PARTICLE_COLORS = {
    cyan: new THREE.Color('#38BDF8'),      // Brighter sky blue
    violet: new THREE.Color('#A855F7'),    // More vibrant purple
    magenta: new THREE.Color('#EC4899'),   // Hot pink accent
    white: new THREE.Color('#F0F9FF'),     // Soft white highlight
} as const

export type ParticleConfig = typeof PARTICLE_CONFIG
