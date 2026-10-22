/* الأولوية للإنترنت: أي تعديل تنشره يظهر للكل، والكاش فقط عند انقطاع النت */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(clients.claim()));
self.addEventListener("fetch",e=>{
  if(e.request.method!="GET"||!e.request.url.startsWith(self.location.origin))return;
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{const c=r.clone();caches.open("torch-v6").then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
