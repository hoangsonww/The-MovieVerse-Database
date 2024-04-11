const CACHE_NAME = 'movieverse-cache-v1';

const urlsToCache = [
    '../../index.html',
    '../css/style.css',
    '../css/trivia.css',
    '../../index.js',
    '../../manifest.json',
    'settings.js',
    '../../images/favicon.ico',
    '../../images/image.png',
    'chatbot.js',
    'movie-details.js',
    'movie-timeline.js',
    'quiz.js',
    'movie-details.js',
    'actor-details.js',
    'director-details.js',
    '../html/about.html',
    '../html/actor-details.html',
    '../html/director-details.html',
    '../html/movie-details.html',
    '../html/movie-timeline.html',
    '../html/trivia.html',
    '../html/settings.html',
    '../html/favorites.html',
    '../html/chatbot.html',
    '../html/settings.html',
    '../html/privacy-policy.html',
    '../html/terms-of-service.html',
    '../../images/black.jpeg',
    '../../images/blue.jpg',
    '../../images/brown.jpg',
    '../../images/green.jpg',
    '../../images/gold.jpg',
    '../../images/grey.png',
    '../../images/orange.jpg',
    '../../images/pink.png',
    '../../images/purple.jpg',
    '../../images/red.jpg',
    '../../images/rose.png',
    '../../images/silver.png',
    '../../images/universe.jpg',
    '../../images/universe.png',
    '../../images/universe-1.png',
    '../../images/universe-2.png',
    '../../images/universe-2.jpg',
    '../../images/universe-3.jpg',
    '../../images/universe-4.png',
    '../../images/universe-5.png',
    '../../images/universe-6.png',
    '../../images/universe-7.png',
    '../../images/universe-8.png',
    '../../images/universe-9.png',
    '../../images/universe-10.png',
    '../../images/yellow.jpg',
    'analytics.js',
    '../html/analytics.html',
    '../html/offline.html',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                const cachePromises = urlsToCache.map(urlToCache => {
                    return fetch(urlToCache).then(response => {
                        if (response.ok) {
                            return cache.put(urlToCache, response);
                        }
                        console.warn(`Could not cache: ${urlToCache} - ${response.statusText}`);
                        return Promise.resolve();
                    }).catch(error => {
                        console.warn(`Failed to fetch and cache: ${urlToCache}`, error);
                        return Promise.resolve();
                    });
                });
                return Promise.all(cachePromises).then(() => {
                    console.log('Finished caching available resources');
                });
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
                    return fetch(event.request).catch(() => {
                        return caches.match('../html/offline.html');
                    });
                })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = ['movieverse-cache-v1'];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
