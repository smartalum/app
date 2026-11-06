const CACHE = "sac-mobile-universal-v1";
const SHELL = ["./", "index.html", "manifest.json", "jsqr.min.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// بنكاش شكل الصفحة والملفات الثابتة بس. أي طلب لشيت جوجل (الأسعار، الأنشطة، إرسال عرض سعر)
// لازم يكون لايف دايمًا، مش بيتكاش هنا.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // سيب طلبات جوجل شيت تعدي عادي، من غير تدخل من الـ service worker
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
