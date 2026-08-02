const CACHE_NAME = 'imc-calculadora';
const ASSETS = [
  './', // Cachear la ruta raíz es una buena práctica para PWAs
  './index.html',
  './style.css',
  './auth.js',
  './app.js',
  './manifest.json',
  './img/icon.webp',
  './img/logo.webp'
];

// Instalación: Guardamos los archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Limpiamos cachés viejas de forma más eficiente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // Primero filtramos solo las cachés que NO son la actual
          .map(key => caches.delete(key))    // Luego las eliminamos
      );
    })
  );
});

// Fetch: Servimos archivos desde caché, con fallback a la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
