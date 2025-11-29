import { useState, useEffect } from 'react'
import useSound from 'use-sound'

// Silent 1-second audio as base64 data URL to prevent 404s when sound file is missing
const SILENT_AUDIO = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQAAAAA='

// Cache for sound file existence checks to prevent repeated HEAD requests
const soundCache = new Map<string, boolean>()

/**
 * Safely wraps useSound to handle missing audio files gracefully
 * Uses a silent audio fallback to prevent 404 network requests
 * 
 * By default, skips file existence checks to eliminate all 404 errors.
 * Set NEXT_PUBLIC_ENABLE_SOUND_CHECK=true to enable sound file checking.
 */
const ENABLE_SOUND_CHECK = process.env.NEXT_PUBLIC_ENABLE_SOUND_CHECK === 'true'

export function useSoundSafe(soundUrl: string, options?: Parameters<typeof useSound>[1]) {
  // By default, use silent audio to prevent 404s (no checking)
  const [soundAvailable, setSoundAvailable] = useState(false)
  const cachedResult = ENABLE_SOUND_CHECK ? soundCache.get(soundUrl) : false
  const [actualUrl, setActualUrl] = useState(
    !ENABLE_SOUND_CHECK || cachedResult === false 
      ? SILENT_AUDIO  // Use silent audio to prevent any requests
      : soundUrl      // Try real file (only if checking is enabled and file exists)
  )

  // Check if sound file exists (only if checking is enabled)
  useEffect(() => {
    // Skip check entirely unless explicitly enabled
    if (!ENABLE_SOUND_CHECK) {
      setSoundAvailable(false)
      return
    }

    // Skip check if we already have a cached result
    if (soundCache.has(soundUrl)) {
      const cached = soundCache.get(soundUrl)
      if (cached) {
        setActualUrl(soundUrl)
        setSoundAvailable(true)
      }
      return
    }

    let cancelled = false

    // Check file existence (will fail silently if file doesn't exist)
    const checkSound = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2s timeout

        const response = await fetch(soundUrl, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)

        if (!cancelled) {
          const exists = response.ok
          soundCache.set(soundUrl, exists) // Cache result
          
          if (exists) {
            setActualUrl(soundUrl)
            setSoundAvailable(true)
          } else {
            // File doesn't exist, keep silent audio
            setSoundAvailable(false)
          }
        }
      } catch {
        // File doesn't exist or check failed - use silent audio
        if (!cancelled) {
          soundCache.set(soundUrl, false) // Cache negative result
          setSoundAvailable(false)
        }
      }
    }

    // Delay check slightly to batch multiple checks
    const timer = setTimeout(checkSound, 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [soundUrl])

  // Always initialize useSound with a valid URL (either real or silent fallback)
  // This prevents Howler from making 404 GET requests
  const [playSound] = useSound(actualUrl, {
    ...options,
    soundEnabled: soundAvailable, // Only enable if real file exists
    volume: soundAvailable ? (options?.volume ?? 1) : 0, // Mute if using fallback
  })

  const safePlay = () => {
    // Only play if real sound is available
    if (soundAvailable && playSound) {
      try {
        playSound()
      } catch {
        // Silently ignore playback errors
      }
    }
  }

  return [safePlay, { isAvailable: soundAvailable }] as const
}

