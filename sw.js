/**
 * IronCoach Pro - Service Worker for Offline Caching & PWA Support
 * استراتيجية Network-First لضمان وصول التحديثات فوراً مع دعم العمل بدون إنترنت
 */

const CACHE_NAME = 'ironcoach-pro-v3.7';
const CORE_ASSETS = [
    './',
    './index.html',
    './LOGO.png',
    './manifest.json',
    './css/luxury-theme.css',
    './css/components.css',
    './js/i18nDataEn.js',
    './js/i18n.js',
    './js/supabaseClient.js',
    './js/config.js',
    './js/mealsData.js',
    './js/exercisesData.js',
    './js/workoutsData.js',
    './js/auth.js',
    './js/calculator.js',
    './js/mealsEngine.js',
    './js/liveGym.js',
    './js/checkinSync.js',
    './js/coachPanel.js',
    './js/app.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('supabase.co')) return;

    const isSameOrigin = event.request.url.startsWith(self.location.origin);

    if (isSameOrigin) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow('./');
        })
    );
});
