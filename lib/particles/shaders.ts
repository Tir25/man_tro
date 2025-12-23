/**
 * Particle Shader Definitions
 * Custom GLSL shaders for the particle system visual effects
 */
import { PARTICLE_CONFIG } from './config'

export const createVertexShader = (): string => `
  attribute float size;
  attribute float opacity;
  attribute float aEffectStrength;
  varying vec3 vColor;
  varying float vOpacity;
  varying float vEffectStrength;

  void main() {
    vColor = color;
    vOpacity = opacity;
    vEffectStrength = aEffectStrength;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    float sizeScale = 1.0 - vEffectStrength * ${PARTICLE_CONFIG.morphSizeFactor.toFixed(2)};
    gl_PointSize = size * sizeScale * (400.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
  }
`

export const createFragmentShader = (): string => `
  uniform sampler2D pointTexture;
  uniform float uGlobalBrightness;
  varying vec3 vColor;
  varying float vOpacity;
  varying float vEffectStrength;

  void main() {
    float alpha = texture2D(pointTexture, gl_PointCoord).a;
    if (alpha < 0.05) discard;

    vec3 finalColor = vColor * uGlobalBrightness * (1.0 + vEffectStrength * ${PARTICLE_CONFIG.morphBrightnessFactor.toFixed(2)});

    gl_FragColor = vec4(finalColor, alpha * vOpacity);
  }
`

/**
 * Creates a radial gradient texture for particles
 */
export function createStarTexture(): THREE.CanvasTexture | null {
    if (typeof document === 'undefined') return null

    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')

    if (!context) return null

    const gradient = context.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
    )
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)

    // Import THREE dynamically to avoid issues
    const THREE = require('three')
    return new THREE.CanvasTexture(canvas)
}
