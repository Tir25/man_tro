/**
 * Particle Shader Definitions
 * Enhanced GLSL shaders for stunning particle visual effects
 */
import * as THREE from 'three'
import { PARTICLE_CONFIG } from './config'

export const createVertexShader = (): string => `
  attribute float size;
  attribute float opacity;
  attribute float aEffectStrength;
  attribute float aRandom;
  
  varying vec3 vColor;
  varying float vOpacity;
  varying float vEffectStrength;
  varying float vDepth;
  varying float vRandom;

  void main() {
    vColor = color;
    vOpacity = opacity;
    vEffectStrength = aEffectStrength;
    vRandom = aRandom;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;

    // Dynamic size based on morph state and depth
    float depthScale = smoothstep(50.0, 10.0, -mvPosition.z);
    float morphScale = 1.0 - vEffectStrength * ${PARTICLE_CONFIG.morphSizeFactor.toFixed(2)};
    float pulseScale = 1.0 + sin(vEffectStrength * 6.28318) * 0.15;
    
    gl_PointSize = size * morphScale * pulseScale * depthScale * (450.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`

export const createFragmentShader = (): string => `
  uniform sampler2D pointTexture;
  uniform float uGlobalBrightness;
  uniform float uTime;
  
  varying vec3 vColor;
  varying float vOpacity;
  varying float vEffectStrength;
  varying float vDepth;
  varying float vRandom;

  void main() {
    // Sample radial texture
    vec2 uv = gl_PointCoord;
    float alpha = texture2D(pointTexture, uv).a;
    if (alpha < 0.02) discard;

    // Core glow effect - brighter center
    float centerDist = length(uv - 0.5) * 2.0;
    float coreGlow = exp(-centerDist * 3.0);
    
    // Effect strength boosts brightness during morphing
    float morphBoost = 1.0 + vEffectStrength * ${PARTICLE_CONFIG.morphBrightnessFactor.toFixed(2)};
    
    // Chromatic shift during morph - adds color variety
    vec3 shiftedColor = vColor;
    if (vEffectStrength > 0.01) {
      float hueShift = sin(vRandom * 6.28 + vEffectStrength * 3.14) * 0.15;
      shiftedColor.r += hueShift * 0.3;
      shiftedColor.b -= hueShift * 0.2;
    }
    
    // Depth-based atmospheric fade
    float depthFade = smoothstep(60.0, 15.0, vDepth);
    
    // Combine all effects
    vec3 finalColor = shiftedColor * uGlobalBrightness * morphBoost;
    finalColor += coreGlow * vec3(1.0, 0.95, 0.98) * 0.35;  // White core highlight
    
    // Final alpha with depth and effect modulation
    float finalAlpha = alpha * vOpacity * depthFade * (0.8 + coreGlow * 0.4);
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

/**
 * Creates an enhanced radial gradient texture with soft glow
 */
export function createStarTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null

  const size = 128  // Higher resolution for smoother gradients
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')

  if (!context) return null

  // Create multi-layered glow effect
  const centerX = size / 2
  const centerY = size / 2

  // Outer soft glow
  const outerGlow = context.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, size / 2
  )
  outerGlow.addColorStop(0, 'rgba(255,255,255,1)')
  outerGlow.addColorStop(0.08, 'rgba(255,255,255,0.95)')
  outerGlow.addColorStop(0.15, 'rgba(255,250,255,0.8)')
  outerGlow.addColorStop(0.3, 'rgba(230,240,255,0.5)')
  outerGlow.addColorStop(0.5, 'rgba(200,220,255,0.2)')
  outerGlow.addColorStop(0.7, 'rgba(180,200,255,0.08)')
  outerGlow.addColorStop(1, 'rgba(150,180,255,0)')

  context.fillStyle = outerGlow
  context.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}
