// Service Worker for Mantro - Caching and Offline Support
const CACHE_NAME = 'mantro-v2'
const STATIC_CACHE_NAME = 'mantro-static-v2'
const DYNAMIC_CACHE_NAME = 'mantro-dynamic-v2'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/icon.svg',
  '/og-image.svg',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting() // Activate immediately
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== STATIC_CACHE_NAME && name !== DYNAMIC_CACHE_NAME
          })
          .map((name) => caches.delete(name))
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Strategy: Cache First for static assets, Network First for API calls
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            // Limit cache size - remove oldest entries if cache is too large
            cache.put(request, responseToCache).then(() => {
              // Clean up old entries (keep last 50)
              cache.keys().then((keys) => {
                if (keys.length > 50) {
                  cache.delete(keys[0])
                }
              })
            })
          })

          return response
        })
        .catch(() => {
          // If network fails and it's a navigation request, return offline page
          if (request.mode === 'navigate') {
            return caches.match('/')
          }
        })
    })
  )
})

// Background sync for offline actions (if needed in future)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Placeholder for future background sync functionality
  return Promise.resolve()
}

