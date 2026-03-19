const CACHE_NAME = 'galaktisk-reversi-v2';
const ASSETS = [
    './index.html',
    './icon.svg',
    './manifest.json'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // Tvingar webbläsaren att installera direkt utan att vänta
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        }).catch(err => console.log('Cache fail:', err))
    );
});

self.addEventListener('fetch', event => {
    // "Network-First" Strategy: Hämta alltid senaste versionen från internet först.
    // Vid offline (flygplansläge), hämta från en sparad fil från cache-minnet
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Spara nyaste versionen i cachen för framtiden
                if (event.request.method === "GET") {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// Clean up old caches if we update CACHE_NAME
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim()); // Tvingar den omedelbart att ta över kontrollen
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});
