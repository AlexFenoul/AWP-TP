self.addEventListener("install", e => {
  caches.open(cacheName).then(cache => {
    cache.addAll(files);
  });
});