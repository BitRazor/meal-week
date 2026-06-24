// offline cache for the meal app — NETWORK-FIRST (freshest when online), cache fallback offline
const C="meal-week-1-ee7fff7b";
const A=["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(A);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==C)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
// NETWORK-FIRST: when online, always fetch the freshest copy and refresh the cache, so a republish
// reaches the user immediately. Only when offline do we fall back to the cached copy. (Cache-first
// was serving stale plans after updates.)
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(function(res){var cp=res.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return res;}).catch(function(){return caches.match(e.request).then(function(r){return r||caches.match('./index.html');});}));});
