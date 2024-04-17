const CACHE_NAME = 'movieverse-cache-v1';

const urlsToCache = [
    '/index.html',
    '/MovieVerse-Frontend/css/style.css',
    '/MovieVerse-Frontend/css/trivia.css',
    '/index.js',
    '/manifest.json',
    '/MovieVerse-Frontend/js/settings.js',
    '/images/favicon.ico',
    '/images/image.png',
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
    '/images/black.jpeg',
    '/images/blue.jpg',
    '/images/brown.jpg',
    '/images/green.jpg',
    '/images/gold.jpg',
    '/images/grey.png',
    '/images/orange.jpg',
    '/images/pink.png',
    '/images/purple.jpg',
    '/images/red.jpg',
    '/images/rose.png',
    '/images/silver.png',
    '/images/universe.jpg',
    '/images/universe.png',
    '/images/universe-1-small.webp',
    '/images/universe-1.webp',
    '/images/universe-2.png',
    '/images/universe-2.jpg',
    '/images/universe-3.jpg',
    '/images/universe-4.png',
    '/images/universe-5.png',
    '/images/universe-6.png',
    '/images/universe-7.png',
    '/images/universe-8.png',
    '/images/universe-9.png',
    '/images/universe-10.png',
    '/images/yellow.jpg',
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