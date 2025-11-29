/**
 * Device detection utilities for performance optimizations
 */

/**
 * Check if device is mobile based on user agent and screen size
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check user agent
  const userAgent = navigator.userAgent || navigator.vendor
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
  const isMobileUA = mobileRegex.test(userAgent)

  // Check screen size (mobile typically < 768px)
  const isMobileScreen = window.innerWidth < 768

  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  return isMobileUA || (isMobileScreen && isTouchDevice)
}

/**
 * Check if device has low performance capabilities
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4
  const isLowCores = cores <= 2

  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4
  const isLowMemory = memory <= 2

  // Check connection speed (if available)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')

  return isLowCores || isLowMemory || isSlowConnection || false
}

/**
 * Get recommended particle count based on device capabilities
 */
export function getRecommendedParticleCount(defaultCount: number): number {
  if (isLowEndDevice()) {
    return Math.floor(defaultCount * 0.3) // 30% for low-end devices
  }
  if (isMobileDevice()) {
    return Math.floor(defaultCount * 0.5) // 50% for mobile devices
  }
  return defaultCount
}

/**
 * Check if WebGL is supported and performant
 */
export function isWebGLPerformant(): boolean {
  if (typeof window === 'undefined') return true

  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    
    if (!gl) return false

    // Check renderer info for GPU capabilities
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
      // Check for known low-performance GPUs
      const lowPerfGPUs = ['adreno', 'mali', 'powervr', 'intel hd', 'intel uhd']
      const isLowPerfGPU = lowPerfGPUs.some(gpu => renderer.toLowerCase().includes(gpu))
      if (isLowPerfGPU && isMobileDevice()) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

