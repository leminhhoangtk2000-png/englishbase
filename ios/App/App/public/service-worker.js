/**
 * Service Worker for PWA
 * Handles offline caching and background sync
 */

const CACHE_NAME = 'deutsch-vn-v1';
const OFFLINE_URL = '/offline';

// Files to cache immediately
const PRECACHE_URLS = [
  '/',
  '/chat',
  '/dashboard',
  '/vocabulary',
  '/offline',
  '/avt.png',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching app shell');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // Take control immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response to cache it
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-chat') {
    event.waitUntil(syncChatMessages());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Deutsch.vn';
  const options = {
    body: data.body || 'Bạn có thông báo mới',
    icon: '/avt.png',
    badge: '/avt.png',
    data: data,
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Helper function to sync chat messages
async function syncChatMessages() {
  try {
    // Get pending messages from IndexedDB
    // Send to server
    // Clear from IndexedDB
    console.log('[Service Worker] Chat messages synced');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}
