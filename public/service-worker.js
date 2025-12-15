self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("tabulas-kiosk-v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/kiosk"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
