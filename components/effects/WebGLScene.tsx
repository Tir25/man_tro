'use client'

import { Canvas } from '@react-three/fiber'
import { type ReactNode } from 'react'
import { Suspense } from 'react'

interface WebGLSceneProps {
  children: ReactNode
  className?: string
}

function SceneContent(): ReactNode {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#7B2CBF" />
      </mesh>
    </>
  )
}

export function WebGLScene({
  children,
  className,
}: WebGLSceneProps): ReactNode {
  return (
    <div className={className}>
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
      >
        <Suspense fallback={null}>
          {children || <SceneContent />}
        </Suspense>
      </Canvas>
    </div>
  )
}
