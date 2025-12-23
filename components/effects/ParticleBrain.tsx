'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react'
import * as THREE from 'three'
import { animate, type JSAnimation, easings } from 'animejs'
import { createNoise3D, createNoise4D } from 'simplex-noise'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import {
  getRecommendedParticleCount,
  isMobileDevice,
} from '@/lib/deviceDetection'

export interface ParticleBrainHandle {
  morphToShape: (shapeIndex: number) => void
}

const BASE_CONFIG = {
  particleCount: 6000, // Reduced from 15000 for better performance
  shapeSize: 14,
  swarmDistanceFactor: 1.5,
  swirlFactor: 4.0,
  noiseFrequency: 0.1,
  noiseTimeScale: 0.04,
  noiseMaxStrength: 2.8,
  morphDuration: 4000,
  particleSizeRange: [0.12, 0.35] as [number, number],
  idleFlowStrength: 0.25,
  idleFlowSpeed: 0.08,
  idleRotationSpeed: 0.02,
  morphSizeFactor: 0.5,
  morphBrightnessFactor: 0.6,
  // Interaction settings
  interactionRadius: 8.0,
  interactionStrength: 2.5,
  interactionSmoothness: 0.15,
  interactionFadeSpeed: 0.05,
}

const CYAN = new THREE.Color('#4CC9F0')
const VIOLET = new THREE.Color('#7B2CBF')

type MorphState = {
  progress: number
}

// --- Shape generators (logic preserved) ---

function generateSphere(count: number, size: number) {
  const points = new Float32Array(count * 3)
  const phi = Math.PI * (Math.sqrt(5) - 1)
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = phi * i
    const x = Math.cos(theta) * radius
    const z = Math.sin(theta) * radius
    points[i * 3] = x * size
    points[i * 3 + 1] = y * size
    points[i * 3 + 2] = z * size
  }
  return points
}

function generateCube(count: number, size: number) {
  const points = new Float32Array(count * 3)
  const halfSize = size / 2
  for (let i = 0; i < count; i++) {
    const face = Math.floor(Math.random() * 6)
    const u = Math.random() * size - halfSize
    const v = Math.random() * size - halfSize
    switch (face) {
      case 0:
        points.set([halfSize, u, v], i * 3)
        break
      case 1:
        points.set([-halfSize, u, v], i * 3)
        break
      case 2:
        points.set([u, halfSize, v], i * 3)
        break
      case 3:
        points.set([u, -halfSize, v], i * 3)
        break
      case 4:
        points.set([u, v, halfSize], i * 3)
        break
      case 5:
        points.set([u, v, -halfSize], i * 3)
        break
    }
  }
  return points
}

function generateGalaxy(count: number, size: number) {
  const points = new Float32Array(count * 3)
  const arms = 4
  const armWidth = 0.6
  const bulgeFactor = 0.3
  for (let i = 0; i < count; i++) {
    const t = Math.pow(Math.random(), 1.5)
    const radius = t * size
    const armIndex = Math.floor(Math.random() * arms)
    const armOffset = (armIndex / arms) * Math.PI * 2
    const rotationAmount = (radius / size) * 6
    const angle = armOffset + rotationAmount
    const spread = (Math.random() - 0.5) * armWidth * (1 - radius / size)
    const theta = angle + spread
    const x = radius * Math.cos(theta)
    const z = radius * Math.sin(theta)
    const y =
      (Math.random() - 0.5) *
      size *
      0.1 *
      (1 - (radius / size) * bulgeFactor)
    points[i * 3] = x
    points[i * 3 + 1] = y
    points[i * 3 + 2] = z
  }
  return points
}

function generateWave(count: number, size: number) {
  const points = new Float32Array(count * 3)
  const waveScale = size * 0.4
  const frequency = 3
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1
    const v = Math.random() * 2 - 1
    const x = u * size
    const z = v * size
    const dist = Math.sqrt(u * u + v * v)
    const angle = Math.atan2(v, u)
    const y =
      Math.sin(dist * Math.PI * frequency) *
      Math.cos(angle * 2) *
      waveScale *
      (1 - dist)
    points[i * 3] = x
    points[i * 3 + 1] = y
    points[i * 3 + 2] = z
  }
  return points
}

interface ParticleBrainProps {
  visible?: boolean
}

export const ParticleBrain = forwardRef<ParticleBrainHandle, ParticleBrainProps>(
  ({ visible = true }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [intersectionRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      rootMargin: '50px', // Start animating slightly before entering viewport
      enabled: true,
    })

    // Adjust particle count based on device capabilities
    const CONFIG = useMemo(() => {
      const particleCount = getRecommendedParticleCount(BASE_CONFIG.particleCount)
      return {
        ...BASE_CONFIG,
        particleCount,
      }
    }, [])
    const isMobile = useMemo(() => isMobileDevice(), [])
    const brightnessMultiplier = useMemo(() => (isMobile ? 1.25 : 1.55), [isMobile])

    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const clockRef = useRef<THREE.Clock | null>(null)

    const particlesGeometryRef = useRef<THREE.BufferGeometry | null>(null)
    const particlesMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
    const particleSystemRef = useRef<THREE.Points | null>(null)

    const currentPositionsRef = useRef<Float32Array | null>(null)
    const sourcePositionsRef = useRef<Float32Array | null>(null)
    const swarmPositionsRef = useRef<Float32Array | null>(null)
    const particleEffectStrengthsRef = useRef<Float32Array | null>(null)

    const targetPositionsRef = useRef<Float32Array[]>([])
    const currentShapeIndexRef = useRef(0)
    const morphStateRef = useRef<MorphState>({ progress: 0 })
    const morphTimelineRef = useRef<JSAnimation | null>(null)
    const isMorphingRef = useRef(false)
    const isInitializedRef = useRef(false)

    const noise3DRef = useRef<ReturnType<typeof createNoise3D> | null>(null)
    const noise4DRef = useRef<ReturnType<typeof createNoise4D> | null>(null)

    const tempVec = useRef(new THREE.Vector3()).current
    const sourceVec = useRef(new THREE.Vector3()).current
    const targetVec = useRef(new THREE.Vector3()).current
    const swarmVec = useRef(new THREE.Vector3()).current
    const noiseOffset = useRef(new THREE.Vector3()).current
    const flowVec = useRef(new THREE.Vector3()).current
    const bezPos = useRef(new THREE.Vector3()).current
    const swirlAxis = useRef(new THREE.Vector3()).current
    const currentVec = useRef(new THREE.Vector3()).current
    const particleToMouse = useRef(new THREE.Vector3()).current

    const animationFrameRef = useRef<number | null>(null)
    const frameIntervalRef = useRef(1000 / 60)
    const lastFrameTimeRef = useRef(0)
    const triggerMorphRef = useRef<((index: number) => void) | null>(null)
    const isPausedRef = useRef(false)

    // Mouse/touch interaction state
    const mouseWorldPositionRef = useRef(new THREE.Vector3())
    const isInteractingRef = useRef(false)
    const interactionStrengthRef = useRef(0)
    const raycasterRef = useRef(new THREE.Raycaster())
    const mouseRef = useRef(new THREE.Vector2())

    useImperativeHandle(ref, () => ({
      morphToShape: (shapeIndex: number) => {
        if (!isInitializedRef.current) return
        const totalShapes = targetPositionsRef.current.length
        if (totalShapes === 0) return
        const index =
          ((Math.floor(shapeIndex) % totalShapes) + totalShapes) % totalShapes
        triggerMorphRef.current?.(index)
      },
    }))

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const dprCap = isMobile ? 1 : 1.5
      frameIntervalRef.current = isMobile ? 1000 / 45 : 1000 / 60
      lastFrameTimeRef.current =
        typeof performance !== 'undefined' ? performance.now() : Date.now()

      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#030304')
      sceneRef.current = scene

      const clock = new THREE.Clock()
      clockRef.current = clock

      noise3DRef.current = createNoise3D(() => Math.random())
      noise4DRef.current = createNoise4D(() => Math.random())

      const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      )
      camera.position.set(0, 8, 28)
      camera.lookAt(scene.position)
      cameraRef.current = camera

      const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      // Cap pixel ratio to prevent performance spikes on high-density screens
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = isMobile ? 1.2 : 1.35
      // Shaders compile automatically on first render
      rendererRef.current = renderer
      const canvas = renderer.domElement
      const containerElement = containerRef.current
      if (containerElement) {
        containerElement.appendChild(canvas)
      }

      scene.add(new THREE.AmbientLight(0x404060))
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
      dirLight1.position.set(15, 20, 10)
      scene.add(dirLight1)
      const dirLight2 = new THREE.DirectionalLight(0x88aaff, 0.8)
      dirLight2.position.set(-15, -10, -15)
      scene.add(dirLight2)

      // --- Particle system setup (logic adapted) ---

      function createStarTexture() {
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
        return new THREE.CanvasTexture(canvas)
      }

      function updateColorArray(colors: Float32Array, positionsArray: Float32Array, particleCount: number) {
        const center = new THREE.Vector3(0, 0, 0)
        const maxRadius = CONFIG.shapeSize * 1.2
        const color = new THREE.Color()

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          tempVec.fromArray(positionsArray, i3)
          const dist = tempVec.distanceTo(center)
          const t = THREE.MathUtils.clamp(dist / maxRadius, 0, 1)
          color.copy(CYAN).lerp(VIOLET, t)
          color.toArray(colors, i3)
        }
      }

      function setupParticleSystem() {
        const targets: Float32Array[] = []
        const particleCount = CONFIG.particleCount
        // Shape order for scrollytelling:
        // 0: Sphere, 1: Galaxy, 2: Wave, 3: Cube
        targets.push(generateSphere(particleCount, CONFIG.shapeSize))
        targets.push(generateGalaxy(particleCount, CONFIG.shapeSize))
        targets.push(generateWave(particleCount, CONFIG.shapeSize))
        targets.push(generateCube(particleCount, CONFIG.shapeSize))

        targetPositionsRef.current = targets

        const geometry = new THREE.BufferGeometry()
        particlesGeometryRef.current = geometry
        const currentPositions = new Float32Array(targets[0])
        const sourcePositions = new Float32Array(targets[0])
        const swarmPositions = new Float32Array(particleCount * 3)

        currentPositionsRef.current = currentPositions
        sourcePositionsRef.current = sourcePositions
        swarmPositionsRef.current = swarmPositions

        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(currentPositions, 3),
        )

        const particleSizes = new Float32Array(particleCount)
        const particleOpacities = new Float32Array(particleCount)
        const particleEffectStrengths = new Float32Array(particleCount)

        for (let i = 0; i < particleCount; i++) {
          particleSizes[i] = THREE.MathUtils.randFloat(
            CONFIG.particleSizeRange[0],
            CONFIG.particleSizeRange[1],
          )
          particleOpacities[i] = 1.0
          particleEffectStrengths[i] = 0.0
        }

        particleEffectStrengthsRef.current = particleEffectStrengths

        geometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
        geometry.setAttribute(
          'opacity',
          new THREE.BufferAttribute(particleOpacities, 1),
        )
        geometry.setAttribute(
          'aEffectStrength',
          new THREE.BufferAttribute(particleEffectStrengths, 1),
        )

        const colors = new Float32Array(particleCount * 3)
        updateColorArray(colors, currentPositions, particleCount)
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const pointTexture = createStarTexture()

        const material = new THREE.ShaderMaterial({
          uniforms: {
            pointTexture: { value: pointTexture },
            uGlobalBrightness: { value: brightnessMultiplier },
          },
          vertexShader: `
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

               float sizeScale = 1.0 - vEffectStrength * ${CONFIG.morphSizeFactor.toFixed(
            2,
          )};
               gl_PointSize = size * sizeScale * (400.0 / -mvPosition.z);

               gl_Position = projectionMatrix * mvPosition;
          }
        `,
          fragmentShader: `
          uniform sampler2D pointTexture;
          uniform float uGlobalBrightness;
          varying vec3 vColor;
          varying float vOpacity;
          varying float vEffectStrength;

          void main() {
               float alpha = texture2D(pointTexture, gl_PointCoord).a;
               if (alpha < 0.05) discard;

               vec3 finalColor = vColor * uGlobalBrightness * (1.0 + vEffectStrength * ${CONFIG.morphBrightnessFactor.toFixed(
            2,
          )});

               gl_FragColor = vec4(finalColor, alpha * vOpacity);
          }
        `,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          transparent: true,
          vertexColors: true,
        })

        particlesMaterialRef.current = material

        const points = new THREE.Points(geometry, material)
        particleSystemRef.current = points
        scene.add(points)
      }

      function updateMorphAnimation(
        positions: Float32Array,
        effectStrengths: Float32Array,
        elapsedTime: number,
        deltaTime: number,
        particleCount: number,
      ) {
        const morphState = morphStateRef.current
        const t = morphState.progress
        const targets = targetPositionsRef.current[currentShapeIndexRef.current]
        const effectStrength = Math.sin(t * Math.PI)
        const currentSwirl = effectStrength * CONFIG.swirlFactor * deltaTime * 50
        const currentNoise = effectStrength * CONFIG.noiseMaxStrength

        // Update interaction strength (fade out when not interacting)
        if (isInteractingRef.current) {
          interactionStrengthRef.current = Math.min(
            1.0,
            interactionStrengthRef.current + CONFIG.interactionSmoothness,
          )
        } else {
          interactionStrengthRef.current = Math.max(
            0.0,
            interactionStrengthRef.current - CONFIG.interactionFadeSpeed,
          )
        }

        const sourcePositions = sourcePositionsRef.current!
        const swarmPositions = swarmPositionsRef.current!
        const noise3D = noise3DRef.current!
        const noise4D = noise4DRef.current!

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          sourceVec.fromArray(sourcePositions, i3)
          swarmVec.fromArray(swarmPositions, i3)
          targetVec.fromArray(targets, i3)

          const t_inv = 1.0 - t
          const t_inv_sq = t_inv * t_inv
          const t_sq = t * t
          bezPos.copy(sourceVec).multiplyScalar(t_inv_sq)
          bezPos.addScaledVector(swarmVec, 2.0 * t_inv * t)
          bezPos.addScaledVector(targetVec, t_sq)

          if (currentSwirl > 0.01) {
            tempVec.subVectors(bezPos, sourceVec)
            swirlAxis
              .set(
                noise3D(i * 0.02, elapsedTime * 0.1, 0),
                noise3D(0, i * 0.02, elapsedTime * 0.1 + 5),
                noise3D(elapsedTime * 0.1 + 10, 0, i * 0.02),
              )
              .normalize()
            tempVec.applyAxisAngle(
              swirlAxis,
              currentSwirl * (0.5 + Math.random() * 0.5),
            )
            bezPos.copy(sourceVec).add(tempVec)
          }

          if (currentNoise > 0.01) {
            const noiseTime = elapsedTime * CONFIG.noiseTimeScale
            noiseOffset.set(
              noise4D(
                bezPos.x * CONFIG.noiseFrequency,
                bezPos.y * CONFIG.noiseFrequency,
                bezPos.z * CONFIG.noiseFrequency,
                noiseTime,
              ),
              noise4D(
                bezPos.x * CONFIG.noiseFrequency + 100,
                bezPos.y * CONFIG.noiseFrequency + 100,
                bezPos.z * CONFIG.noiseFrequency + 100,
                noiseTime,
              ),
              noise4D(
                bezPos.x * CONFIG.noiseFrequency + 200,
                bezPos.y * CONFIG.noiseFrequency + 200,
                bezPos.z * CONFIG.noiseFrequency + 200,
                noiseTime,
              ),
            )
            bezPos.addScaledVector(noiseOffset, currentNoise)
          }

          // Apply mouse/touch interaction during morph
          if (interactionStrengthRef.current > 0.01) {
            particleToMouse.subVectors(bezPos, mouseWorldPositionRef.current)
            const distance = particleToMouse.length()
            const interactionRadius = CONFIG.interactionRadius

            if (distance < interactionRadius && distance > 0.01) {
              particleToMouse.normalize()
              const force = (1.0 - distance / interactionRadius) * CONFIG.interactionStrength
              const interactionForce = force * interactionStrengthRef.current
              bezPos.addScaledVector(particleToMouse, interactionForce)
            }
          }

          positions[i3] = bezPos.x
          positions[i3 + 1] = bezPos.y
          positions[i3 + 2] = bezPos.z

          effectStrengths[i] = effectStrength
        }

        const geometry = particlesGeometryRef.current
        if (geometry) {
          geometry.attributes.aEffectStrength.needsUpdate = true
        }
      }

      function updateIdleAnimation(
        positions: Float32Array,
        effectStrengths: Float32Array,
        elapsedTime: number,
        _deltaTime: number,
        particleCount: number,
      ) {
        const sourcePositions = sourcePositionsRef.current!
        const noise4D = noise4DRef.current!
        const breathScale = 1.0 + Math.sin(elapsedTime * 0.5) * 0.015
        const timeScaled = elapsedTime * CONFIG.idleFlowSpeed
        const freq = 0.1

        // Update interaction strength (fade out when not interacting)
        if (isInteractingRef.current) {
          interactionStrengthRef.current = Math.min(
            1.0,
            interactionStrengthRef.current + CONFIG.interactionSmoothness,
          )
        } else {
          interactionStrengthRef.current = Math.max(
            0.0,
            interactionStrengthRef.current - CONFIG.interactionFadeSpeed,
          )
        }

        let needsEffectStrengthReset = false

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          sourceVec.fromArray(sourcePositions, i3)
          tempVec.copy(sourceVec).multiplyScalar(breathScale)
          flowVec.set(
            noise4D(tempVec.x * freq, tempVec.y * freq, tempVec.z * freq, timeScaled),
            noise4D(
              tempVec.x * freq + 10,
              tempVec.y * freq + 10,
              tempVec.z * freq + 10,
              timeScaled,
            ),
            noise4D(
              tempVec.x * freq + 20,
              tempVec.y * freq + 20,
              tempVec.z * freq + 20,
              timeScaled,
            ),
          )
          tempVec.addScaledVector(flowVec, CONFIG.idleFlowStrength)

          // Apply mouse/touch interaction
          if (interactionStrengthRef.current > 0.01) {
            currentVec.fromArray(positions, i3)
            particleToMouse.subVectors(currentVec, mouseWorldPositionRef.current)
            const distance = particleToMouse.length()
            const interactionRadius = CONFIG.interactionRadius

            if (distance < interactionRadius && distance > 0.01) {
              // Normalize and apply repulsion force
              particleToMouse.normalize()
              const force = (1.0 - distance / interactionRadius) * CONFIG.interactionStrength
              const interactionForce = force * interactionStrengthRef.current
              tempVec.addScaledVector(particleToMouse, interactionForce)

              // Increase effect strength for visual feedback
              effectStrengths[i] = Math.min(1.0, effectStrengths[i] + interactionForce * 0.3)
              needsEffectStrengthReset = true
            }
          }

          currentVec.fromArray(positions, i3)
          currentVec.lerp(tempVec, 0.05)
          positions[i3] = currentVec.x
          positions[i3 + 1] = currentVec.y
          positions[i3 + 2] = currentVec.z

          if (!isInteractingRef.current && effectStrengths[i] > 0.0) {
            effectStrengths[i] = Math.max(0.0, effectStrengths[i] - 0.05)
            if (effectStrengths[i] > 0.0) {
              needsEffectStrengthReset = true
            }
          }
        }

        if (needsEffectStrengthReset) {
          const geometry = particlesGeometryRef.current
          if (geometry) {
            geometry.attributes.aEffectStrength.needsUpdate = true
          }
        }
      }

      function triggerMorph(targetShapeIndex: number) {
        // Allow morph interruption - if already morphing, cancel previous animation
        if (isMorphingRef.current && morphTimelineRef.current) {
          morphTimelineRef.current.pause()
        }

        // Don't morph if already at target shape
        if (currentShapeIndexRef.current === targetShapeIndex && !isMorphingRef.current) {
          return
        }

        const geometry = particlesGeometryRef.current
        const currentPositions = currentPositionsRef.current
        const sourcePositions = sourcePositionsRef.current
        const swarmPositions = swarmPositionsRef.current

        if (!geometry || !currentPositions || !sourcePositions || !swarmPositions)
          return

        isMorphingRef.current = true

        const nextTargetPositions = targetPositionsRef.current[targetShapeIndex]
        const centerOffsetAmount = CONFIG.shapeSize * CONFIG.swarmDistanceFactor
        const noise3D = noise3DRef.current!
        const particleCount = CONFIG.particleCount

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          sourceVec.fromArray(sourcePositions, i3)
          targetVec.fromArray(nextTargetPositions, i3)
          swarmVec.lerpVectors(sourceVec, targetVec, 0.5)
          const offsetDir = tempVec
            .set(
              noise3D(i * 0.05, 10, 10),
              noise3D(20, i * 0.05, 20),
              noise3D(30, 30, i * 0.05),
            )
            .normalize()
          const distFactor = sourceVec.distanceTo(targetVec) * 0.1 + centerOffsetAmount
          swarmVec.addScaledVector(offsetDir, distFactor * (0.5 + Math.random() * 0.8))
          swarmPositions[i3] = swarmVec.x
          swarmPositions[i3 + 1] = swarmVec.y
          swarmPositions[i3 + 2] = swarmVec.z
        }

        // Update source positions from current positions (snapshot current state)
        sourcePositions.set(currentPositions)

        currentShapeIndexRef.current = targetShapeIndex
        morphStateRef.current.progress = 0

        morphTimelineRef.current = animate(morphStateRef.current, {
          progress: 1,
          duration: CONFIG.morphDuration,
          ease: easings.cubicBezier(0.4, 0.0, 0.2, 1.0),
          onComplete: () => {
            currentPositions.set(targetPositionsRef.current[currentShapeIndexRef.current])
            geometry.attributes.position.needsUpdate = true
            const effectStrengths = particleEffectStrengthsRef.current
            if (effectStrengths) {
              effectStrengths.fill(0.0)
              geometry.attributes.aEffectStrength.needsUpdate = true
            }
            sourcePositions.set(
              targetPositionsRef.current[currentShapeIndexRef.current],
            )
            const colors = geometry.attributes.color
            updateColorArray(
              colors.array as Float32Array,
              geometry.attributes.position.array as Float32Array,
              CONFIG.particleCount,
            )
            colors.needsUpdate = true
            isMorphingRef.current = false
          },
        })
      }

      // expose triggerMorph through ref for imperative handle
      triggerMorphRef.current = (idx: number) => triggerMorph(idx)

      setupParticleSystem()
      isInitializedRef.current = true

      // Renamed from 'animate' to 'renderLoop' to avoid shadowing the imported 'animate' function from animejs
      function renderLoop(time: number) {
        animationFrameRef.current = window.requestAnimationFrame(renderLoop)
        if (!isInitializedRef.current) return

        // Pause animation when not visible
        if (isPausedRef.current) {
          lastFrameTimeRef.current = time
          return
        }

        if (time - lastFrameTimeRef.current < frameIntervalRef.current) {
          return
        }
        lastFrameTimeRef.current = time

        const clock = clockRef.current
        const scene = sceneRef.current
        const camera = cameraRef.current
        const renderer = rendererRef.current
        const geometry = particlesGeometryRef.current
        const effectStrengths = particleEffectStrengthsRef.current

        if (!clock || !scene || !camera || !renderer || !geometry || !effectStrengths)
          return

        const elapsedTime = clock.getElapsedTime()
        const deltaTime = clock.getDelta()

        const positions = geometry.attributes.position.array as Float32Array
        const effects = effectStrengths
        const particleCount = CONFIG.particleCount

        if (isMorphingRef.current) {
          updateMorphAnimation(positions, effects, elapsedTime, deltaTime, particleCount)
        } else {
          updateIdleAnimation(positions, effects, elapsedTime, deltaTime, particleCount)
        }

        geometry.attributes.position.needsUpdate = true

        renderer.render(scene, camera)
      }

      renderLoop(lastFrameTimeRef.current)

      function handleResize() {
        const camera = cameraRef.current
        const renderer = rendererRef.current
        if (!camera || !renderer) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        // Maintain pixel ratio cap on resize
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
      }

      // Mouse and touch interaction handlers
      function updateMouseWorldPosition(clientX: number, clientY: number) {
        const camera = cameraRef.current
        const renderer = rendererRef.current
        if (!camera || !renderer) return

        const rect = renderer.domElement.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * 2 - 1
        const y = -((clientY - rect.top) / rect.height) * 2 + 1

        mouseRef.current.set(x, y)
        raycasterRef.current.setFromCamera(mouseRef.current, camera)

        // Project to a plane at a distance from camera (around where particles are)
        const distance = 20
        mouseWorldPositionRef.current.copy(raycasterRef.current.ray.origin)
        mouseWorldPositionRef.current.addScaledVector(
          raycasterRef.current.ray.direction,
          distance,
        )
      }

      function handleMouseMove(event: MouseEvent) {
        isInteractingRef.current = true
        updateMouseWorldPosition(event.clientX, event.clientY)
      }

      function handleMouseLeave() {
        isInteractingRef.current = false
      }

      function handleTouchStart(event: TouchEvent) {
        if (event.touches.length > 0) {
          isInteractingRef.current = true
          updateMouseWorldPosition(event.touches[0].clientX, event.touches[0].clientY)
        }
      }

      function handleTouchMove(event: TouchEvent) {
        if (event.touches.length > 0) {
          isInteractingRef.current = true
          updateMouseWorldPosition(event.touches[0].clientX, event.touches[0].clientY)
        }
      }

      function handleTouchEnd() {
        isInteractingRef.current = false
      }

      // Add event listeners to window so interaction works even when canvas is behind content
      const touchListenerOptions: AddEventListenerOptions = { passive: isMobile }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('touchstart', handleTouchStart, touchListenerOptions)
      window.addEventListener('touchmove', handleTouchMove, touchListenerOptions)
      window.addEventListener('touchend', handleTouchEnd, touchListenerOptions)
      window.addEventListener('touchcancel', handleTouchEnd, touchListenerOptions)
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseleave', handleMouseLeave)
        window.removeEventListener('touchstart', handleTouchStart, touchListenerOptions)
        window.removeEventListener('touchmove', handleTouchMove, touchListenerOptions)
        window.removeEventListener('touchend', handleTouchEnd, touchListenerOptions)
        window.removeEventListener('touchcancel', handleTouchEnd, touchListenerOptions)
        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current)
        }
        if (morphTimelineRef.current) {
          morphTimelineRef.current.pause()
        }
        if (particleSystemRef.current) {
          sceneRef.current?.remove(particleSystemRef.current)
        }
        particlesGeometryRef.current?.dispose()
        particlesMaterialRef.current?.dispose()
        const renderer = rendererRef.current
        // Use captured container reference from effect start
        if (renderer?.domElement && container) {
          container.removeChild(renderer.domElement)
        }
        renderer?.dispose()
        triggerMorphRef.current = null
      }
    }, [CONFIG, isMobile])
    /* eslint-enable react-hooks/exhaustive-deps */

    // Pause animation when not visible (intersection + explicit visible flag)
    useEffect(() => {
      isPausedRef.current = !isVisible || !visible
    }, [isVisible, visible])

    // Sync container ref with intersection observer ref using callback ref
    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node
      // Update intersection observer ref
      if (intersectionRef.current) {
        ; (intersectionRef.current as any).current = node
      }
    }

    return (
      <div
        ref={setRefs}
        className="fixed inset-0 z-0"
        aria-hidden="true"
        style={{ touchAction: isMobile ? 'manipulation' : 'none' }}
      />
    )
  })

ParticleBrain.displayName = 'ParticleBrain'

export default ParticleBrain


