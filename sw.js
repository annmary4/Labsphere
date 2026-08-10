/* ============================================================
   LabSphere Service Worker - Offline Cache & PWA Support
   ============================================================ */

const CACHE_NAME = 'labsphere-v10360';
const ASSETS_TO_CACHE = [
  '/Labsphere/',
  '/Labsphere/index.html',
  '/Labsphere/css/styles.css',
  '/Labsphere/js/app.js',
  '/Labsphere/js/types.js',
  '/Labsphere/js/initialData.js',
  '/Labsphere/js/storage.js',
  '/Labsphere/js/rackViewer.js',
  '/Labsphere/js/componentsView.js',
  '/Labsphere/js/modalManager.js',
  '/Labsphere/icons/icon-192.png',
  '/Labsphere/icons/icon-512.png',
  '/Labsphere/manifest.json'
];

// ---- Install: cache all static assets ----
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// ---- Activate: clean up old caches ----
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ---- Fetch: Network-first for HTML, Cache-first for assets ----
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests and same-origin (or GitHub Pages CDN)
  if (request.method !== 'GET') return;

  // For external CDN (fonts, icons CDN) - use network only
  if (url.origin !== location.origin) return;

  // Network-first strategy for HTML pages (always fresh)
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('/Labsphere/')))
    );
    return;
  }

  // Cache-first strategy for CSS, JS, images
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
