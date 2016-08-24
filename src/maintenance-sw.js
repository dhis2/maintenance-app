const thirdPartyLibraries = [
    "polyfill.min.js",
    "jquery.min.js",
    "react-with-touch.js",
    "rx.lite.js",
    "ckeditor/ckeditor.js",
    "lodash.js",
    "lodash-functional.js",
    "vendor-e05c9e1757540e264918.js",
    "maintenance-e05c9e1757540e264918.js",
];

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open('maintenance-app').then(function (cache) {
        return cache.addAll(thirdPartyLibraries);
    }));
});

self.addEventListener('fetch', function (event) {
    if (!thirdPartyLibraries.find(fileName => event.request.url.endsWith(fileName))) {
        console.log('Not a library request');
        return;
    }

    const networkRequest = caches.open('maintenance-app')
        .then(function (cache) {
            return fetch(event.request, { credentials: 'same-origin' })
                .then(function (fetchResponse) {
                    console.log('Saving ' + event.request.url + ' to cache');
                    cache.add(event.request, fetchResponse);

                    return fetchResponse;
                });
        });

    console.log('Library request for', event.request.url);
    event.respondWith(caches.open('maintenance-app')
        .then(function (cache) {
           return cache.match(event.request)
               .then(function (response) {
                   console.log(response);
                   if (response) {
                       console.log('Responding from cache for', event.request.url);
                       return response;
                   }
                   return networkRequest;
               });
        })
    );
});
