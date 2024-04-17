const CACHE_NAME = 'movieverse-cache-v1';

const urlsToCache = [
    '/index.html',
    '/MovieVerse-Frontend/css/style.css',
    '/MovieVerse-Frontend/css/trivia.css',
    '/index.js',
    '/manifest.json',
    '/MovieVerse-Frontend/js/settings.js',
    '/images/favicon.ico',
    '/images/image.webp',
    '/MovieVerse-Frontend/js/chatbot.js',
    '/MovieVerse-Frontend/js/movie-details.js',
    '/MovieVerse-Frontend/js/movie-timeline.js',
    '/MovieVerse-Frontend/js/quiz.js',
    '/MovieVerse-Frontend/js/movie-details.js',
    '/MovieVerse-Frontend/js/actor-details.js',
    '/MovieVerse-Frontend/js/director-details.js',
    '/MovieVerse-Frontend/html/about.html',
    '/MovieVerse-Frontend/html/actor-details.html',
    '/MovieVerse-Frontend/html/director-details.html',
    '/MovieVerse-Frontend/html/movie-details.html',
    '/MovieVerse-Frontend/html/movie-timeline.html',
    '/MovieVerse-Frontend/html/trivia.html',
    '/MovieVerse-Frontend/html/settings.html',
    '/MovieVerse-Frontend/html/favorites.html',
    '/MovieVerse-Frontend/html/chatbot.html',
    '/MovieVerse-Frontend/html/settings.html',
    '/MovieVerse-Frontend/html/privacy-policy.html',
    '/MovieVerse-Frontend/html/terms-of-service.html',
    '/images/black.webp',
    '/images/blue.webp',
    '/images/brown.webp',
    '/images/green.webp',
    '/images/gold.webp',
    '/images/grey.webp',
    '/images/orange.webp',
    '/images/pink.webp',
    '/images/purple.webp',
    '/images/red.webp',
    '/images/rose.webp',
    '/images/silver.webp',
    '/images/universe.webp',
    '/images/universe.webp',
    '/images/universe-1-small.webp',
    '/images/universe-22.webp',
    '/images/universe-2.webp',
    '/images/universe-2.webp',
    '/images/universe-3.webp',
    '/images/universe-4.webp',
    '/images/universe-5.webp',
    '/images/universe-6.webp',
    '/images/universe-7.webp',
    '/images/universe-8.webp',
    '/images/universe-9.webp',
    '/images/universe-10.webp',
    '/images/yellow.webp',
    '/MovieVerse-Frontend/js/analytics.js',
    '/MovieVerse-Frontend/html/analytics.html',
    '/MovieVerse-Frontend/html/offline.html',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(fetchResponse => {
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, fetchResponse.clone());
                                return fetchResponse;
                            });
                    })
                    .catch(() => caches.match('/MovieVerse-Frontend/html/offline.html'));
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => !cacheWhitelist.includes(cacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});