import {offlineFallback, warmStrategyCache} from 'workbox-recipes';
import {CacheFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {registerRoute, Route} from 'workbox- routing';
import {CacheableReponsePlugin} from 'workbox-cacheable-reponse';
import {ExpirationPlugin} from 'workbox-expiration'

let cacheName = "my-pwa-receitas";
let filesToCache = ["/", "/index.html", "/css/style.css", "/js/main.js", "/images", "/manifest.json", "/chef.png"];

//configurando o cache
const pageCache = new CacheFirst({
  cacheName: 'primeira-pwa-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30* 24 * 60 * 60,
    }),
  ],
});

//indicando o cache da página
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache
});

//resgistrando a rota
registerRoute(({request}) => request.mode === 'navigate', pageCache);

//configurando cache de assets
registerRoute(
  ({request}) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableReponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

//configurando offline fallback
offlineFallback({
  pageFallback: '/offline.html',
})

const imageRoute = new Route(({request}) => {
  return request.destination === 'image';
},new CacheFirst({
plugins: [
  new ExpirationPlugin({
    maxAgeSeconds: 60 * 60 * 24 * 30,
  })
]
}));

registerRoute(imageRoute);

/* inicializando a service worker e fazendo o 
download do conteúdo da aplicação */
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* disponibilizando o conteudo quando estiver offline */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

