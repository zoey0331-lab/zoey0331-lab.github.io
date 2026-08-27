/* 华南文研 · Service Worker —— 离线缓存，支持"添加到主屏幕"离线使用 */
const CACHE = "hszy-v3.0.0";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./qbank.js",
  "./assets/icon.png",
  "./assets/icon-180.png",
  "./assets/真题_2022-2026.pdf",
  "./assets/陶东风拆书精读.pdf",
  "./assets/文学理论_三版本教材对比复习指南.pdf",
  "./assets/西方文论_复习思路拆解.pdf",
  "./assets/古代文论_五论四坐标轴语料库.pdf",
  "./assets/古代文论_四要素拆解.pdf",
  "./assets/本质论×839真题.pdf",
  "./assets/创作论×839真题.pdf",
  "./assets/作品论×839真题.pdf",
  "./assets/读者论×839真题.pdf",
  "./assets/发展论×839真题.pdf"
];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  e.respondWith(caches.match(req).then(function(hit){
    var net = fetch(req).then(function(res){
      if(res && res.ok && req.url.indexOf(self.location.origin) === 0){
        var cp = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, cp); });
      }
      return res;
    }).catch(function(){ return hit; });
    return hit || net;
  }));
});
