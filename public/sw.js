const CACHE_NAME = 'version-1';
const urlsToCache = [ '*'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache)
                    .then(() => console.log('All resources have been added to cache'))
                    .catch(err => {
                        console.error('Error adding resources to cache', err);
                        throw err; // Rethrow after logging to make sure it's caught by outer .catch
                    });
            })
            .catch(err => {
                console.error('Error opening cache', err);
                throw err; // Ensure this error is visible and not silently swallowed
            })
    );
});



self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'));
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});