/* ============================================================
   LabSphere Service Worker - Offline Cache & PWA Support
   ============================================================ */

const CACHE_NAME = 'labsphere-v11200_student_edit_cancel_added_components';
const ASSETS_TO_CACHE = [
  '/Labsphere/',
  '/Labsphere/index.html',
  '/Labsphere/css/styles.css?v=11200_student_edit_cancel_added_components',
  '/Labsphere/js/app.js?v=11200_student_edit_cancel_added_components',
  '/Labsphere/js/types.js?v=11200_student_edit_cancel_added_components',
  '/Labsphere/js/initialData.js?v=11200_student_edit_cancel_added_components',
  '/Labsphere/js/storage.js?v=11200_student_edit_cancel_added_components',
  '/Labsphere/js/rackViewer.js?v=11200_student_edit_cancel_added_components',
  '/Labsphere/js/componentsView.js?v=11200_student_edit_cancel_added_components',
  '/Labsphere/js/modalManager.js?v=11200_student_edit_cancel_added_components',
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
