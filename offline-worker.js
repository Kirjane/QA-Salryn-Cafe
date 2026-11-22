/* Kirjane QA offline REVIEW ONLY. No POS, financial authority or background sync. */
"use strict";
const CACHE = "kirjane-salryn-qa-static-9086261-v1";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./qa-app.css", "./install-qa.js",
  "./styles.css", "./portal-modules.css", "./config.js", "./app.js",
  "./visual-review.js", "./sandbox.js", "./data/screens.json", "./data/screens-data.js",
  "./assets/kirjane-logo-green.jpg", "./assets/qa-app-icon.svg"
];
const scopePath = new URL(self.registration.scope).pathname;
function sameOriginStatic(value) {
  const url = new URL(value, self.registration.scope);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(scopePath)) return null;
  const relative = url.pathname.slice(scopePath.length);
  if (relative.startsWith("api/") || relative.includes("..")) return null;
  return url.href;
}
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    const response = await cache.match("./data/screens.json");
    if (!response || !response.ok) throw new Error("Screen manifest unavailable offline");
    const manifest = await response.json();
    const images = [...new Set((manifest.screens || []).map(s => s.image).filter(Boolean))];
    if (images.length !== 73) throw new Error("Expected 73 approved unique screenshots");
    for (let i = 0; i < images.length; i += 8) {
      const urls = images.slice(i, i + 8).map(value => {
        if (!value.startsWith("assets/screenshots/")) throw new Error("Unexpected image path");
        return sameOriginStatic(value);
      });
      if (urls.some(value => !value)) throw new Error("Unsafe screenshot URL");
      await cache.addAll(urls);
    }
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("kirjane-salryn-qa-static-") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = sameOriginStatic(request.url);
  if (!url) return;
  const relative = new URL(url).pathname.slice(scopePath.length);
  if (relative.startsWith("api/")) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try { return await fetch(request); }
      catch { return await (await caches.open(CACHE)).match("./index.html") || Response.error(); }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request, {ignoreSearch: true});
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && (relative.startsWith("assets/") || /\.(css|js|json|webmanifest|html|svg)$/.test(relative))) {
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
self.addEventListener("message", event => {
  if (event.data?.type === "QA_OFFLINE_STATUS") {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const response = await cache.match("./data/screens.json");
      if (!response) { event.source?.postMessage({type:"QA_OFFLINE_STATUS",ready:false}); return; }
      const manifest = await response.json();
      const images = [...new Set((manifest.screens || []).map(s => s.image).filter(Boolean))];
      const hits = await Promise.all(images.map(path => cache.match(path)));
      event.source?.postMessage({type:"QA_OFFLINE_STATUS",ready:hits.length === 73 && hits.every(Boolean),cachedScreenshots:hits.filter(Boolean).length,totalScreenshots:images.length});
    })());
  }
});