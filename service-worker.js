importScripts("/precache-manifest.d57691b279a5ee10319cfae8f6d61c46.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

console.log('PWA Service-worker')
// Должно быть true в production
var doCache = true
// Имя кэша
var CACHE_NAME = 'my-pwa-cache-v2'

// Очищает старый кэш
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log('Deleting cache: ' + key)
            return caches.delete(key)
          }
        }))
      )
  )
})

// 'install' вызывается, как только пользователь впервые открывает PWA
self.addEventListener('install', function (event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          // Получаем данные из манифеста (они кэшируются)
          fetch('manifest.json')
            .then(response => {
              response.json()
            })
            .then(assets => {
              // Открываем и кэшируем нужные страницы и файлы
              const urlsToCache = [
                '/',
                '/history',
                '/list'
              ]
              cache.addAll(urlsToCache)
              console.log('cached')
            })
        })
    )
  }
})

// Когда приложение запущено, сервис-воркер перехватывает запросы и отвечает на них данными из кэша, если они есть
self.addEventListener('fetch', function (event) {
  if (doCache) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request)
      })
    )
  }
})

