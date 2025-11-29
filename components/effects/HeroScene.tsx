'use client'

import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { isMobileDevice } from '@/lib/deviceDetection'

function AbstractShape() {
    const meshRef = useRef<THREE.Mesh>(null)
    const innerMeshRef = useRef<THREE.Mesh>(null)

    // Optimized geometry - reduced detail for better performance
    const geometry = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(2, 2) // Reduced from 20 to 2 for better performance
        return geo
    }, [])

    const innerGeometry = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(1.5, 0)
        return geo
    }, [])

    useFrame((state) => {
        if (!meshRef.current || !innerMeshRef.current) return

        const time = state.clock.getElapsedTime()

        // Rotate slightly
        meshRef.current.rotation.x = time * 0.1
        meshRef.current.rotation.y = time * 0.15

        // Inner mesh rotation (opposite direction)
        innerMeshRef.current.rotation.x = -time * 0.15
        innerMeshRef.current.rotation.y = -time * 0.1

        // Mouse interaction (parallax) - with bounds checking
        const { x, y } = state.pointer
        if (Math.abs(x) < 10 && Math.abs(y) < 10) {
            meshRef.current.rotation.x += y * 0.01
            meshRef.current.rotation.y += x * 0.01
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} geometry={geometry}>
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.1}
                    metalness={0.9}
                    wireframe={true}
                    emissive="#7B2CBF"
                    emissiveIntensity={0.2}
                />
            </mesh>
            {/* Inner glowing core */}
            <mesh ref={innerMeshRef} geometry={innerGeometry}>
                <meshBasicMaterial color="#4CC9F0" wireframe={true} transparent opacity={0.3} />
            </mesh>
        </Float>
    )
}

// Component to handle WebGL context loss
function WebGLContextHandler() {
    const { gl } = useThree()
    const [, setContextLost] = useState(false)

    useEffect(() => {
        const handleContextLost = (event: Event) => {
            event.preventDefault()
            setContextLost(true)
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.warn('WebGL context lost, attempting to restore...')
            }
        }

        const handleContextRestored = () => {
            setContextLost(false)
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('WebGL context restored')
            }
        }

        const canvas = gl.domElement
        canvas.addEventListener('webglcontextlost', handleContextLost)
        canvas.addEventListener('webglcontextrestored', handleContextRestored)

        return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost)
            canvas.removeEventListener('webglcontextrestored', handleContextRestored)
        }
    }, [gl])

    return null
}

// Fallback component when WebGL fails
function SceneFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-neon-violet/20 to-electric-cyan/20 blur-3xl animate-pulse" />
        </div>
    )
}

export function HeroScene({ className }: { className?: string }) {
    const [webGLAvailable, setWebGLAvailable] = useState(true)
    const [containerRef] = useIntersectionObserver<HTMLDivElement>({
        threshold: 0.1,
        rootMargin: '50px',
    })
    const isMobile = useMemo(() => isMobileDevice(), [])

    useEffect(() => {
        // Check if WebGL is available
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (!gl) {
            setWebGLAvailable(false)
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.warn('WebGL is not available, using fallback')
            }
        }
    }, [])

    if (!webGLAvailable) {
        return (
            <div className={className}>
                <SceneFallback />
            </div>
        )
    }

    return (
        <div ref={containerRef} className={className}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{
                    antialias: !isMobile, // Disable antialiasing on mobile for better performance
                    alpha: false,
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: false,
                }}
                dpr={[1, 1.5]} // Cap pixel ratio to prevent performance issues on Retina displays
                frameloop="always"
                performance={{ min: 0.5 }}
                onCreated={({ gl }) => {
                    // Configure WebGL context
                    gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
                    gl.shadowMap.enabled = false
                }}
            >
                <Suspense fallback={null}>
                    <WebGLContextHandler />
                    <color attach="background" args={['#030304']} />
                    <fog attach="fog" args={['#030304', 5, 15]} />

                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#4CC9F0" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#7B2CBF" />

                    <AbstractShape />

                    <Stars
                        radius={100}
                        depth={50}
                        count={typeof window !== 'undefined' && window.innerWidth < 768 ? 500 : 1000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={1}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
