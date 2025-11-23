const CACHE = "cag-v1";
const ASSETS = [
  "/", "/index.html",
  "/src/main.js", "/src/router.js", "/src/styles.css",
  "/src/game/ui.js", "/src/game/engine.js", "/src/game/gameState.js",
  "/src/game/feedback.js", "/src/game/difficulty.js",
  "/src/game/storage.js", "/src/game/accessibility.js",
  "/src/analytics/metrics.js",
  "/src/data/messages.json", "/src/data/banks-whitelist.json",
  "/public/estudo.pdf", "/icon-192.png", "/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match("/index.html")))
  );
});