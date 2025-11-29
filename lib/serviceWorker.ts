/**
 * Service Worker registration utility
 */

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Registration successful
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('Service Worker registered:', registration.scope)
          }

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('New service worker available')
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          // Registration failed
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('Service Worker registration failed:', error)
          }
        })
    })
  }
}

export function unregisterServiceWorker(): void {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Service Worker unregistration failed:', error)
        }
      })
  }
}

