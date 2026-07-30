/*
 * GymForge service worker — offline-first.
 *
 * Design notes:
 *  - OneSignal's script is imported inside try/catch. It lives on a remote CDN,
 *    so on a plane (or anywhere the CDN is blocked) importScripts throws. If that
 *    throw escapes, the ENTIRE service worker fails to install and you get no
 *    offline support at all — precisely when you need it most.
 *  - The app shell is precached at install time, so the app opens offline even
 *    on a route you hadn't visited before losing signal.
 *  - Vite emits content-hashed asset filenames, so those are safe to serve
 *    cache-first. The precache list is injected at build time.
 */

try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  // Push notifications unavailable — the rest of the worker still works.
}

const CACHE = 'gymforge-v3';

// Replaced at build time by scripts/inject-sw-precache.mjs
const PRECACHE = self.__GYMFORGE_PRECACHE__ || ['./', './index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache =>
        // Individual puts: one bad URL must not fail the whole install.
        Promise.all(
          PRECACHE.map(url =>
            fetch(new Request(url, { cache: 'reload' }))
              .then(res => (res.ok ? cache.put(url, res) : null))
              .catch(() => null)
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico|webmanifest)$/i.test(pathname);
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  const url = new URL(req.url);

  // Cross-origin (Anthropic API, OneSignal CDN): never intercept or cache.
  // Serving a stale AI response would be worse than a clear network error.
  if (url.origin !== self.location.origin) return;

  // Page navigations: network first, fall back to the cached shell so the app
  // still boots offline. HashRouter means every route lives in index.html.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req)
            .then(hit => hit || caches.match('./index.html'))
            .then(hit => hit || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } }))
        )
    );
    return;
  }

  // Hashed static assets are immutable: cache-first is both fastest and the
  // most reliable offline.
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(req).then(hit => {
        if (hit) return hit;
        return fetch(req)
          .then(res => {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
            return res;
          })
          .catch(() => new Response('', { status: 504 }));
      })
    );
    return;
  }

  // Everything else same-origin: network first, cache fallback.
  event.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || new Response('', { status: 504 })))
  );
});
