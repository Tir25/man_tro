'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface MouseState {
  x: number
  y: number
  progressX: number
  progressY: number
}

const initialState: MouseState = {
  x: 0,
  y: 0,
  progressX: 0,
  progressY: 0,
}

export function useMouse<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [state, setState] = useState<MouseState>(initialState)

  const handleMove = useCallback((event: MouseEvent) => {
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const progressX = rect.width ? x / rect.width : 0
    const progressY = rect.height ? y / rect.height : 0

    setState({
      x,
      y,
      progressX: progressX * 2 - 1,
      progressY: progressY * 2 - 1,
    })
  }, [])

  const handleLeave = useCallback(() => {
    setState(initialState)
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return

    node.addEventListener('mousemove', handleMove)
    node.addEventListener('mouseleave', handleLeave)

    return () => {
      node.removeEventListener('mousemove', handleMove)
      node.removeEventListener('mouseleave', handleLeave)
    }
  }, [handleLeave, handleMove])

  return { ref, ...state }
}

