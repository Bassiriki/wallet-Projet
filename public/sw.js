const CACHE_NAME = 'portefeuille-v1'
const APP_SHELL = ['/', '/historique', '/statistiques', '/ajouter', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL).catch(() => {})),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  // Never cache auth or API calls
  if (url.pathname.startsWith('/api')) return

  // Network-first for navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/'))),
    )
    return
  }

  // Cache Next.js Data payloads (RSC) with Network-First to avoid stale data!
  if (request.headers.get('RSC') === '1' || url.pathname.includes('/_next/data/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    )
    return
  }

  // Cache-first ONLY for static assets (_next/static, images, etc.)
  const isStatic = url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|woff2|woff|css|js)$/i)
  
  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            if (url.origin === self.location.origin) {
              const copy = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            }
            return response
          })
        )
      })
    )
  } else {
    // Network-first for everything else
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (url.origin === self.location.origin) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
  }
})
