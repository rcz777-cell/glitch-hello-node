/*
 * ServiceWorker to make site function as a PWA (Progressive Web App)
 *
 * Based on https://glitch.com/~pwa by https://glitch.com/@PaulKinlan
 */

// Specify what we want added to the cache for offline use
self.addEventListener("install", e => {
  e.waitUntil(
    // Give the cache a name
    caches.open("hello-node-pwa").then(cache => {
      // Add the homepage and stylesheet
      return cache.addAll(["/", "/style.css"]);
    })
  );
});

// Cache falling back to network approach - we only initially listed the home route to cache
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      //Do we have something in the cache - return it
      if (response !== undefined) {
        return response;
      } else {
        // Nothing in cache so try fetching
        return fetch(event.request)
          .then(function(response) {
            // Add to the cache
            caches.open("hello-node-pwa").then(function(cache) {
              // Clone the cache https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/match
              cache.put(event.request, response.clone());
            });
            return response;
          })
          .catch(function() {
            // If no available cache and no connection return the homepage as a fallback
            return caches.match("/");
          });
      }
    })
  );
});
