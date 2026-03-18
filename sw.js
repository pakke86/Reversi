const CACHE_NAME = 'galaktisk-reversi-v1';
const ASSETS = [
    './index.html',
    './icon.svg',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        }).catch(err => console.log('Cache fail:', err))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                // If network fails (offline), and isn't cached, what to do?
                // Just let it fail. Firebase handles offline state internally beautifully anyway!
            });
        })
    );
});

// Clean up old caches if we update CACHE_NAME
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});
