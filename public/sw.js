// Minimal service worker — its only job is to exist, which is one of the
// requirements browsers check before offering "Install app". No caching:
// this app always needs a live connection to talk to the story/illustration
// API anyway, so there's nothing useful to serve offline.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Intentionally not intercepted — pass every request straight through to the network.
});
