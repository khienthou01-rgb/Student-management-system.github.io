/**
 * Service Worker for MasterSchool PWA
 * Caches app shell, stylesheets, icons, and fonts for offline support and instant loading
 */
const CACHE_NAME = "masterschool-v2.0-digital-theme-hud";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/variables.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/idcard.css",
  "./css/student-modal.css",
  "./js/config.js",
  "./js/data.js",
  "./js/exam_papers.js",
  "./js/auth.js",
  "./js/api.js",
  "./js/charts.js",
  "./js/services/telegram.js",
  "./js/components/sidebar.js",
  "./js/components/header.js",
  "./js/components/modals.js",
  "./js/views/login.js",
  "./js/views/student_portal.js",
  "./js/views/dashboard.js",
  "./js/views/register.js",
  "./js/views/directory.js",
  "./js/views/attendance.js",
  "./js/views/timetable.js",
  "./js/views/exams.js",
  "./js/views/fees.js",
  "./js/views/certificates.js",
  "./js/views/resources.js",
  "./js/views/settings.js",
  "./js/app.js",
  "./assets/images/default-male.svg",
  "./assets/images/default-female.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell assets...");
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("[Service Worker] Some assets could not be cached:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Do not cache Firebase realtime DB or external API POST requests
  if (
    event.request.method !== "GET" ||
    requestUrl.origin.includes("firebasedatabase.app") ||
    requestUrl.origin.includes("api.telegram.org") ||
    requestUrl.origin.includes("googleapis.com") && requestUrl.pathname.includes("/v1/")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is HTML, return cached index
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("./index.html");
          }
        });
    })
  );
});
