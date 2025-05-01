const CACHE_NAME = 'hello-pwa-cache-v1';
const urlsToCache = [
  'index.html',
  'script.js',
  'styles.css'
  // Add paths to icons if you want them cached immediately
  // '/home/user/hello-pwa/icons/icon-192x192.png',
  // '/home/user/hello-pwa/icons/icon-512x512.png'
];

// Install event: Cache the core assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate worker immediately
  );
});

// Activate event: Clean up old caches if any (optional for this simple case)
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim()); // Take control of pages immediately
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});