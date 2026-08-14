/* ============================================================
   LabSphere Service Worker - Offline Cache & PWA Support
   ============================================================ */

const CACHE_NAME = 'labsphere-v10470_all_student_requests_tabs';
const ASSETS_TO_CACHE = [
  '/Labsphere/',
  '/Labsphere/index.html',
  '/Labsphere/css/styles.css?v=10470_all_student_requests_tabs',
  '/Labsphere/js/app.js?v=10470_all_student_requests_tabs',
  '/Labsphere/js/types.js?v=10470_all_student_requests_tabs',
  '/Labsphere/js/initialData.js?v=10470_all_student_requests_tabs',
  '/Labsphere/js/storage.js?v=10470_all_student_requests_tabs',
  '/Labsphere/js/rackViewer.js?v=10470_all_student_requests_tabs',
  '/Labsphere/js/componentsView.js?v=10470_all_student_requests_tabs',
  '/Labsphere/js/modalManager.js?v=10470_all_student_requests_tabs',
  '/Labsphere/icons/icon-192.png',
  '/Labsphere/icons/icon-512.png',
  '/Labsphere/manifest.json'
];

// ---- Install: cache static assets & skip waiting ----
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ---- Activate: clean up ALL old caches & claim clients ----
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

// ---- Fetch: Network-first for HTML, JS, CSS so latest GitHub push is served instantly ----
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
