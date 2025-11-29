import { useEffect, useRef, useState } from 'react'

const CRYPTIC_CHARS = '_/-#X$01[]*'

const getRandomChar = () =>
  CRYPTIC_CHARS[Math.floor(Math.random() * CRYPTIC_CHARS.length)] ?? '#'

const generateScrambled = (length: number) =>
  Array.from({ length }, () => getRandomChar()).join('')

export interface UseDecryptionResult {
  displayText: string
  isDecrypting: boolean
  startDecryption: () => void
  reset: () => void
}

/**
 * useDecryption
 *
 * Given a target string, returns an encrypted "scrambled" version
 * that can progressively decrypt over a short duration.
 */
export function useDecryption(
  targetText: string,
  options?: {
    durationMs?: number
    fps?: number
  }
): UseDecryptionResult {
  const { durationMs = 400, fps = 30 } = options ?? {}

  // Start with the stable targetText so SSR + hydration match.
  // We'll scramble client-side via effects/interactions only.
  const [displayText, setDisplayText] = useState<string>(targetText)
  const [isDecrypting, setIsDecrypting] = useState(false)

  const intervalRef = useRef<number | null>(null)
  const progressRef = useRef(0)

  const clearTimer = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const reset = () => {
    clearTimer()
    progressRef.current = 0
    setIsDecrypting(false)
    setDisplayText(generateScrambled(targetText.length))
  }

  const startDecryption = () => {
    if (!targetText.length) return

    clearTimer()
    setIsDecrypting(true)
    progressRef.current = 0

    const totalSteps = Math.max(1, Math.round((durationMs / 1000) * fps))
    const intervalMs = durationMs / totalSteps

    intervalRef.current = window.setInterval(() => {
      progressRef.current += 1
      const ratio = Math.min(1, progressRef.current / totalSteps)
      const revealCount = Math.floor(ratio * targetText.length)

      setDisplayText(() => {
        // Build a new string each frame with a leading "resolved" section
        // and a trailing scrambled section.
        const resolved = targetText.slice(0, revealCount)
        const remainingLength = targetText.length - revealCount

        if (remainingLength <= 0) {
          return targetText
        }

        const scrambledTail = Array.from({ length: remainingLength }, () =>
          getRandomChar()
        ).join('')

        // Slight randomization of already-resolved area to keep it "alive"
        // while still converging to the correct characters.
        const jitteredResolved = resolved
          .split('')
          .map((char, idx) => {
            if (ratio < 0.8 && Math.random() < 0.05 && idx < resolved.length - 1)
              return getRandomChar()
            return char
          })
          .join('')

        return jitteredResolved + scrambledTail
      })

      if (ratio >= 1) {
        clearTimer()
        setIsDecrypting(false)
        setDisplayText(targetText)
      }
    }, intervalMs) as unknown as number
  }

  // Reset scrambling whenever the target text changes
  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetText])

  useEffect(
    () => () => {
      clearTimer()
    },
    []
  )

  return { displayText, isDecrypting, startDecryption, reset }
}


