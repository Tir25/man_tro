'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { animate, type JSAnimation, easings } from 'animejs'
import { createNoise3D, createNoise4D } from 'simplex-noise'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import {
  getRecommendedParticleCount,
  isMobileDevice,
  isLowEndDevice,
} from '@/lib/deviceDetection'
import {
  PARTICLE_CONFIG,
  PARTICLE_COLORS,
  SHAPE_GENERATORS,
  createVertexShader,
  createFragmentShader,
} from '@/lib/particles'

export interface ParticleBrainHandle {
  morphToShape: (shapeIndex: number) => void
}

type MorphState = {
  progress: number
}

interface ParticleBrainProps {
  visible?: boolean
}

/**
 * Creates a radial gradient texture for particles (inlined for Tree-shaking)
 */
function createStarTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null

  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')

  if (!context) return null

  const gradient = context.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  )
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

/**
 * Updates particle colors based on distance from center
 */
function updateColorArray(
  colors: Float32Array,
  positionsArray: Float32Array,
  particleCount: number,
  shapeSize: number,
  tempVec: THREE.Vector3
): void {
  const center = new THREE.Vector3(0, 0, 0)
  const maxRadius = shapeSize * 1.2
  const color = new THREE.Color()

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    tempVec.fromArray(positionsArray, i3)
    const dist = tempVec.distanceTo(center)
    const t = THREE.MathUtils.clamp(dist / maxRadius, 0, 1)
    color.copy(PARTICLE_COLORS.cyan).lerp(PARTICLE_COLORS.violet, t)
    color.toArray(colors, i3)
  }
}

export const ParticleBrain = forwardRef<ParticleBrainHandle, ParticleBrainProps>(
  ({ visible = true }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [intersectionRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      rootMargin: '50px',
      enabled: true,
    })

    // Device detection with proper hydration handling
    const [isMobile, setIsMobile] = useState(false)
    const [isLowEnd, setIsLowEnd] = useState(false)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
      setIsMobile(isMobileDevice())
      setIsLowEnd(isLowEndDevice())
      setIsHydrated(true)

      // Check for reduced motion preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Adjust particle count based on device capabilities (after hydration)
    const CONFIG = {
      ...PARTICLE_CONFIG,
      particleCount: isHydrated
        ? getRecommendedParticleCount(PARTICLE_CONFIG.particleCount)
        : Math.floor(PARTICLE_CONFIG.particleCount * 0.5), // Conservative default
    }
    const brightnessMultiplier = isMobile ? 1.25 : 1.55

    // Three.js refs
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const clockRef = useRef<THREE.Clock | null>(null)

    // Particle system refs
    const particlesGeometryRef = useRef<THREE.BufferGeometry | null>(null)
    const particlesMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
    const particleSystemRef = useRef<THREE.Points | null>(null)

    // Position buffers
    const currentPositionsRef = useRef<Float32Array | null>(null)
    const sourcePositionsRef = useRef<Float32Array | null>(null)
    const swarmPositionsRef = useRef<Float32Array | null>(null)
    const particleEffectStrengthsRef = useRef<Float32Array | null>(null)

    // Shape and morph state
    const targetPositionsRef = useRef<Float32Array[]>([])
    const currentShapeIndexRef = useRef(0)
    const morphStateRef = useRef<MorphState>({ progress: 0 })
    const morphTimelineRef = useRef<JSAnimation | null>(null)
    const isMorphingRef = useRef(false)
    const isInitializedRef = useRef(false)

    // Noise generators
    const noise3DRef = useRef<ReturnType<typeof createNoise3D> | null>(null)
    const noise4DRef = useRef<ReturnType<typeof createNoise4D> | null>(null)

    // Reusable THREE.Vector3 instances (optimization)
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

    // Animation state
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
      if (!container || !isHydrated) return

      // Skip WebGL entirely for reduced motion preference - show static fallback
      if (prefersReducedMotion) return

      const dprCap = isMobile ? 1 : 1.5
      // Adaptive frame rate: 30fps for low-end, 45fps for mobile, 60fps for desktop
      frameIntervalRef.current = isLowEnd ? 1000 / 30 : (isMobile ? 1000 / 45 : 1000 / 60)
      lastFrameTimeRef.current =
        typeof performance !== 'undefined' ? performance.now() : Date.now()

      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#030304')
      sceneRef.current = scene

      const clock = new THREE.Clock()
      clockRef.current = clock

      noise3DRef.current = createNoise3D(() => Math.random())
      noise4DRef.current = createNoise4D(() => Math.random())

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.set(0, 8, 28)
      camera.lookAt(scene.position)
      cameraRef.current = camera

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = isMobile ? 1.2 : 1.35
      rendererRef.current = renderer
      container.appendChild(renderer.domElement)

      // Lighting
      scene.add(new THREE.AmbientLight(0x404060))
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
      dirLight1.position.set(15, 20, 10)
      scene.add(dirLight1)
      const dirLight2 = new THREE.DirectionalLight(0x88aaff, 0.8)
      dirLight2.position.set(-15, -10, -15)
      scene.add(dirLight2)

      // Generate target positions for all shapes
      const targets: Float32Array[] = SHAPE_GENERATORS.map((generator) =>
        generator(CONFIG.particleCount, CONFIG.shapeSize)
      )
      targetPositionsRef.current = targets

      // Particle geometry setup
      const geometry = new THREE.BufferGeometry()
      particlesGeometryRef.current = geometry
      const currentPositions = new Float32Array(targets[0])
      const sourcePositions = new Float32Array(targets[0])
      const swarmPositions = new Float32Array(CONFIG.particleCount * 3)

      currentPositionsRef.current = currentPositions
      sourcePositionsRef.current = sourcePositions
      swarmPositionsRef.current = swarmPositions

      geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))

      // Particle attributes
      const particleSizes = new Float32Array(CONFIG.particleCount)
      const particleOpacities = new Float32Array(CONFIG.particleCount)
      const particleEffectStrengths = new Float32Array(CONFIG.particleCount)

      for (let i = 0; i < CONFIG.particleCount; i++) {
        particleSizes[i] = THREE.MathUtils.randFloat(
          CONFIG.particleSizeRange[0],
          CONFIG.particleSizeRange[1]
        )
        particleOpacities[i] = 1.0
        particleEffectStrengths[i] = 0.0
      }

      particleEffectStrengthsRef.current = particleEffectStrengths

      geometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
      geometry.setAttribute('opacity', new THREE.BufferAttribute(particleOpacities, 1))
      geometry.setAttribute('aEffectStrength', new THREE.BufferAttribute(particleEffectStrengths, 1))

      // Colors
      const colors = new Float32Array(CONFIG.particleCount * 3)
      updateColorArray(colors, currentPositions, CONFIG.particleCount, CONFIG.shapeSize, tempVec)
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      // Material with shaders
      const material = new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: { value: createStarTexture() },
          uGlobalBrightness: { value: brightnessMultiplier },
        },
        vertexShader: createVertexShader(),
        fragmentShader: createFragmentShader(),
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

      // Morph animation function
      function updateMorphAnimation(
        positions: Float32Array,
        effectStrengths: Float32Array,
        elapsedTime: number,
        deltaTime: number,
        particleCount: number
      ): void {
        const t = morphStateRef.current.progress
        const currentTargets = targetPositionsRef.current[currentShapeIndexRef.current]
        const effectStrength = Math.sin(t * Math.PI)
        const currentSwirl = effectStrength * CONFIG.swirlFactor * deltaTime * 50
        const currentNoise = effectStrength * CONFIG.noiseMaxStrength

        // Update interaction strength
        if (isInteractingRef.current) {
          interactionStrengthRef.current = Math.min(1.0, interactionStrengthRef.current + CONFIG.interactionSmoothness)
        } else {
          interactionStrengthRef.current = Math.max(0.0, interactionStrengthRef.current - CONFIG.interactionFadeSpeed)
        }

        const srcPositions = sourcePositionsRef.current!
        const swrmPositions = swarmPositionsRef.current!
        const noise3D = noise3DRef.current!
        const noise4D = noise4DRef.current!

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          sourceVec.fromArray(srcPositions, i3)
          swarmVec.fromArray(swrmPositions, i3)
          targetVec.fromArray(currentTargets, i3)

          // Bezier interpolation
          const t_inv = 1.0 - t
          const t_inv_sq = t_inv * t_inv
          const t_sq = t * t
          bezPos.copy(sourceVec).multiplyScalar(t_inv_sq)
          bezPos.addScaledVector(swarmVec, 2.0 * t_inv * t)
          bezPos.addScaledVector(targetVec, t_sq)

          // Swirl effect
          if (currentSwirl > 0.01) {
            tempVec.subVectors(bezPos, sourceVec)
            swirlAxis.set(
              noise3D(i * 0.02, elapsedTime * 0.1, 0),
              noise3D(0, i * 0.02, elapsedTime * 0.1 + 5),
              noise3D(elapsedTime * 0.1 + 10, 0, i * 0.02)
            ).normalize()
            tempVec.applyAxisAngle(swirlAxis, currentSwirl * (0.5 + Math.random() * 0.5))
            bezPos.copy(sourceVec).add(tempVec)
          }

          // Noise displacement
          if (currentNoise > 0.01) {
            const noiseTime = elapsedTime * CONFIG.noiseTimeScale
            noiseOffset.set(
              noise4D(bezPos.x * CONFIG.noiseFrequency, bezPos.y * CONFIG.noiseFrequency, bezPos.z * CONFIG.noiseFrequency, noiseTime),
              noise4D(bezPos.x * CONFIG.noiseFrequency + 100, bezPos.y * CONFIG.noiseFrequency + 100, bezPos.z * CONFIG.noiseFrequency + 100, noiseTime),
              noise4D(bezPos.x * CONFIG.noiseFrequency + 200, bezPos.y * CONFIG.noiseFrequency + 200, bezPos.z * CONFIG.noiseFrequency + 200, noiseTime)
            )
            bezPos.addScaledVector(noiseOffset, currentNoise)
          }

          // Mouse interaction
          if (interactionStrengthRef.current > 0.01) {
            particleToMouse.subVectors(bezPos, mouseWorldPositionRef.current)
            const distance = particleToMouse.length()
            if (distance < CONFIG.interactionRadius && distance > 0.01) {
              particleToMouse.normalize()
              const force = (1.0 - distance / CONFIG.interactionRadius) * CONFIG.interactionStrength
              bezPos.addScaledVector(particleToMouse, force * interactionStrengthRef.current)
            }
          }

          positions[i3] = bezPos.x
          positions[i3 + 1] = bezPos.y
          positions[i3 + 2] = bezPos.z
          effectStrengths[i] = effectStrength
        }

        if (geometry) geometry.attributes.aEffectStrength.needsUpdate = true
      }

      // Idle animation function
      function updateIdleAnimation(
        positions: Float32Array,
        effectStrengths: Float32Array,
        elapsedTime: number,
        _deltaTime: number,
        particleCount: number
      ): void {
        const srcPositions = sourcePositionsRef.current!
        const noise4D = noise4DRef.current!
        const breathScale = 1.0 + Math.sin(elapsedTime * 0.5) * 0.015
        const timeScaled = elapsedTime * CONFIG.idleFlowSpeed
        const freq = 0.1

        if (isInteractingRef.current) {
          interactionStrengthRef.current = Math.min(1.0, interactionStrengthRef.current + CONFIG.interactionSmoothness)
        } else {
          interactionStrengthRef.current = Math.max(0.0, interactionStrengthRef.current - CONFIG.interactionFadeSpeed)
        }

        let needsEffectStrengthReset = false

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          sourceVec.fromArray(srcPositions, i3)
          tempVec.copy(sourceVec).multiplyScalar(breathScale)
          flowVec.set(
            noise4D(tempVec.x * freq, tempVec.y * freq, tempVec.z * freq, timeScaled),
            noise4D(tempVec.x * freq + 10, tempVec.y * freq + 10, tempVec.z * freq + 10, timeScaled),
            noise4D(tempVec.x * freq + 20, tempVec.y * freq + 20, tempVec.z * freq + 20, timeScaled)
          )
          tempVec.addScaledVector(flowVec, CONFIG.idleFlowStrength)

          if (interactionStrengthRef.current > 0.01) {
            currentVec.fromArray(positions, i3)
            particleToMouse.subVectors(currentVec, mouseWorldPositionRef.current)
            const distance = particleToMouse.length()
            if (distance < CONFIG.interactionRadius && distance > 0.01) {
              particleToMouse.normalize()
              const force = (1.0 - distance / CONFIG.interactionRadius) * CONFIG.interactionStrength
              const interactionForce = force * interactionStrengthRef.current
              tempVec.addScaledVector(particleToMouse, interactionForce)
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
            if (effectStrengths[i] > 0.0) needsEffectStrengthReset = true
          }
        }

        if (needsEffectStrengthReset && geometry) {
          geometry.attributes.aEffectStrength.needsUpdate = true
        }
      }

      // Morph trigger function
      function triggerMorph(targetShapeIndex: number): void {
        if (isMorphingRef.current && morphTimelineRef.current) {
          morphTimelineRef.current.pause()
        }

        if (currentShapeIndexRef.current === targetShapeIndex && !isMorphingRef.current) return

        const curPositions = currentPositionsRef.current
        const srcPositions = sourcePositionsRef.current
        const swrmPositions = swarmPositionsRef.current
        if (!geometry || !curPositions || !srcPositions || !swrmPositions) return

        isMorphingRef.current = true

        const nextTargetPositions = targetPositionsRef.current[targetShapeIndex]
        const centerOffsetAmount = CONFIG.shapeSize * CONFIG.swarmDistanceFactor
        const noise3D = noise3DRef.current!

        for (let i = 0; i < CONFIG.particleCount; i++) {
          const i3 = i * 3
          sourceVec.fromArray(srcPositions, i3)
          targetVec.fromArray(nextTargetPositions, i3)
          swarmVec.lerpVectors(sourceVec, targetVec, 0.5)
          const offsetDir = tempVec.set(
            noise3D(i * 0.05, 10, 10),
            noise3D(20, i * 0.05, 20),
            noise3D(30, 30, i * 0.05)
          ).normalize()
          const distFactor = sourceVec.distanceTo(targetVec) * 0.1 + centerOffsetAmount
          swarmVec.addScaledVector(offsetDir, distFactor * (0.5 + Math.random() * 0.8))
          swrmPositions[i3] = swarmVec.x
          swrmPositions[i3 + 1] = swarmVec.y
          swrmPositions[i3 + 2] = swarmVec.z
        }

        srcPositions.set(curPositions)
        currentShapeIndexRef.current = targetShapeIndex
        morphStateRef.current.progress = 0

        morphTimelineRef.current = animate(morphStateRef.current, {
          progress: 1,
          duration: CONFIG.morphDuration,
          ease: easings.cubicBezier(0.4, 0.0, 0.2, 1.0),
          onComplete: () => {
            curPositions.set(targetPositionsRef.current[currentShapeIndexRef.current])
            geometry.attributes.position.needsUpdate = true
            const effects = particleEffectStrengthsRef.current
            if (effects) {
              effects.fill(0.0)
              geometry.attributes.aEffectStrength.needsUpdate = true
            }
            srcPositions.set(targetPositionsRef.current[currentShapeIndexRef.current])
            const colorsAttr = geometry.attributes.color
            updateColorArray(
              colorsAttr.array as Float32Array,
              geometry.attributes.position.array as Float32Array,
              CONFIG.particleCount,
              CONFIG.shapeSize,
              tempVec
            )
            colorsAttr.needsUpdate = true
            isMorphingRef.current = false
          },
        })
      }

      triggerMorphRef.current = triggerMorph
      isInitializedRef.current = true

      // Render loop
      function renderLoop(time: number): void {
        animationFrameRef.current = window.requestAnimationFrame(renderLoop)
        if (!isInitializedRef.current || isPausedRef.current) {
          lastFrameTimeRef.current = time
          return
        }

        if (time - lastFrameTimeRef.current < frameIntervalRef.current) return
        lastFrameTimeRef.current = time

        const clk = clockRef.current
        const scn = sceneRef.current
        const cam = cameraRef.current
        const rnd = rendererRef.current
        const geo = particlesGeometryRef.current
        const effects = particleEffectStrengthsRef.current

        if (!clk || !scn || !cam || !rnd || !geo || !effects) return

        const elapsedTime = clk.getElapsedTime()
        const deltaTime = clk.getDelta()
        const positions = geo.attributes.position.array as Float32Array

        if (isMorphingRef.current) {
          updateMorphAnimation(positions, effects, elapsedTime, deltaTime, CONFIG.particleCount)
        } else {
          updateIdleAnimation(positions, effects, elapsedTime, deltaTime, CONFIG.particleCount)
        }

        geo.attributes.position.needsUpdate = true
        rnd.render(scn, cam)
      }

      renderLoop(lastFrameTimeRef.current)

      // Event handlers
      function handleResize(): void {
        const cam = cameraRef.current
        const rnd = rendererRef.current
        if (!cam || !rnd) return
        cam.aspect = window.innerWidth / window.innerHeight
        cam.updateProjectionMatrix()
        rnd.setSize(window.innerWidth, window.innerHeight)
        rnd.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
      }

      function updateMouseWorldPosition(clientX: number, clientY: number): void {
        const cam = cameraRef.current
        const rnd = rendererRef.current
        if (!cam || !rnd) return

        const rect = rnd.domElement.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * 2 - 1
        const y = -((clientY - rect.top) / rect.height) * 2 + 1

        mouseRef.current.set(x, y)
        raycasterRef.current.setFromCamera(mouseRef.current, cam)

        const distance = 20
        mouseWorldPositionRef.current.copy(raycasterRef.current.ray.origin)
        mouseWorldPositionRef.current.addScaledVector(raycasterRef.current.ray.direction, distance)
      }

      function handleMouseMove(event: MouseEvent): void {
        isInteractingRef.current = true
        updateMouseWorldPosition(event.clientX, event.clientY)
      }

      function handleMouseLeave(): void {
        isInteractingRef.current = false
      }

      function handleTouchStart(event: TouchEvent): void {
        if (event.touches.length > 0) {
          isInteractingRef.current = true
          updateMouseWorldPosition(event.touches[0].clientX, event.touches[0].clientY)
        }
      }

      function handleTouchMove(event: TouchEvent): void {
        if (event.touches.length > 0) {
          isInteractingRef.current = true
          updateMouseWorldPosition(event.touches[0].clientX, event.touches[0].clientY)
        }
      }

      function handleTouchEnd(): void {
        isInteractingRef.current = false
      }

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
        const rnd = rendererRef.current
        if (rnd?.domElement && container) {
          container.removeChild(rnd.domElement)
        }
        rnd?.dispose()
        triggerMorphRef.current = null
      }
    }, [CONFIG.particleCount, isMobile, isLowEnd, isHydrated, prefersReducedMotion])
    /* eslint-enable react-hooks/exhaustive-deps */

    // Pause animation when not visible
    useEffect(() => {
      isPausedRef.current = !isVisible || !visible
    }, [isVisible, visible])

    // Sync container ref with intersection observer ref
    const setRefs = (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (intersectionRef.current) {
        ; (intersectionRef.current as any).current = node
      }
    }

    // Show loading state before hydration
    if (!isHydrated) {
      return (
        <div
          className="fixed inset-0 z-0 flex items-center justify-center bg-[#030304]"
          aria-hidden="true"
        >
          <div className="h-16 w-16 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
        </div>
      )
    }

    // Static fallback for reduced motion or very low-end devices
    if (prefersReducedMotion) {
      return (
        <div
          className="fixed inset-0 z-0 bg-[#030304]"
          aria-hidden="true"
        >
          {/* Static gradient as fallback */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(ellipse 50% 50% at 50% 50%, rgba(76,201,240,0.3), transparent 70%),
                radial-gradient(ellipse 40% 40% at 60% 40%, rgba(123,44,191,0.3), transparent 60%)
              `
            }}
          />
        </div>
      )
    }

    return (
      <div
        ref={setRefs}
        className="fixed inset-0 z-0"
        aria-hidden="true"
        style={{ touchAction: isMobile ? 'manipulation' : 'none' }}
      />
    )
  }
)

ParticleBrain.displayName = 'ParticleBrain'

export default ParticleBrain
