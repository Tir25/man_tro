/**
 * Shape Generators for ParticleBrain
 * Pure functions that generate Float32Array positions for different 3D shapes
 */

/**
 * Generates a sphere using Fibonacci spiral distribution for even coverage
 */
export function generateSphere(count: number, size: number): Float32Array {
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

/**
 * Generates a cube with particles distributed on all 6 faces
 */
export function generateCube(count: number, size: number): Float32Array {
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

/**
 * Generates a spiral galaxy with multiple arms and central bulge
 */
export function generateGalaxy(count: number, size: number): Float32Array {
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

/**
 * Generates a wave/ripple surface pattern
 */
export function generateWave(count: number, size: number): Float32Array {
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

// Shape order for scrollytelling: 0: Sphere, 1: Galaxy, 2: Wave, 3: Cube
export const SHAPE_GENERATORS = [
    generateSphere,
    generateGalaxy,
    generateWave,
    generateCube,
] as const

export type ShapeGenerator = (count: number, size: number) => Float32Array
