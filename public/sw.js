/*
 * ServiceWorker to make site function as a PWA (Progressive Web App)
 *
 * Based on https://glitch.com/~pwa by https://glitch.com/@PaulKinlan
 */

// Specify what we want added to the cache for offline use
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("hello-node-pwa").then(cache => {
      return cache.addAll(["/", "/style.css"]);
    })
  );
});

// Cache falling back to network approach - but we only initially listed the home route to cache
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      //do we have something in the cache
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(response) {
            //add to the cache
            caches.open("hello-node-pwa").then(function(cache) {
              cache.put(event.request, response.clone());
            });
            return response;
          })
          .catch(function() {
            //if no available cache and no connection return the homepage
            return caches.match("/");
          });
      }
    })
  );
});
