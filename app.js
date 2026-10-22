/* ===== إعداداتك: بدّل الروابط بحساباتك ===== */
const C={
  telegram:"https://t.me/YOUR_USERNAME",
  whatsapp:"https://wa.me/9647XXXXXXXXX",
  discord:"https://discord.com/users/YOUR_ID",
  tiktok:"https://www.tiktok.com/@YOUR_USERNAME"
};
/* الأقسام: [الاسم, الوصف, الأيقونة] */
const S={
  box:["Box","صناديق جاهزة للاستخدام","📦"],
  quick:["Quick","منتجات تسليم سريع","⚡"],
  scoreboard:["Tab Scoreboard","لوحات النتائج والتاب","🏆"],
  blogs:["Plugins","بلوقنات وإضافات جاهزة","🧩"],
  publish:["انشر منتجك","انشر منتجاتك واربح 80%","💰"],
  news:["News","أخبار المتجر","📰"],
  server:["صناعة سيرفر","نكمل لك سيرفرك بسعر واضح","🖥️"]
};
/* المنتجات: s=القسم, n=الاسم, d=الوصف, p=السعر, img="images/اسم.jpg" (اختياري) */
const P=[
{id:"b1",s:"box",n:"Starter Box",d:"صندوق للمبتدئين فيه الأساسيات.",p:"5$"},
{id:"b2",s:"box",n:"Pro Box",d:"صندوق متكامل للسيرفرات الكبيرة.",p:"12$"},
{id:"q1",s:"quick",n:"Quick Setup",d:"إعداد سريع يُسلَّم بنفس اليوم.",p:"4$"},
{id:"q2",s:"quick",n:"Quick Menu",d:"قائمة جاهزة تركّبها بدقائق.",p:"6$"},
{id:"t1",s:"scoreboard",n:"Tab Classic",d:"تاب بتصميم كلاسيكي واضح.",p:"3$"},
{id:"t2",s:"scoreboard",n:"Scoreboard Flame",d:"لوحة نتائج بتأثير ناري متحرك.",p:"7$"},
{id:"g1",s:"blogs",n:"Chat Plugin",d:"بلوقن شات منظم وقابل للتعديل.",p:"8$"},
{id:"g2",s:"blogs",n:"Shop Plugin",d:"بلوقن متجر داخل السيرفر.",p:"10$"},
{id:"v1",s:"server",n:"سيرفر أساسي",d:"نجهز لك سيرفر كامل بإعدادات أساسية.",p:"20$"},
{id:"v2",s:"server",n:"سيرفر احترافي",d:"سيرفر مع بلوقنات وتاب وسكوربورد.",p:"45$"},
{id:"v3",s:"server",n:"سيرفر مخصص",d:"حسب طلبك وتفاصيلك بالكامل.",p:"حسب الطلب"}
];
/* الأخبار: [التاريخ, النص] */
const N=[
["2026-10-22","افتتاح Torch Store رسمياً 🔥"],
["2026-10-22","تم نشر منتج جديد: Starter Box"],
["2026-10-22","فتح باب الطلب على صناعة السيرفرات"]
];

/* ===== الكود ===== */
const pg=document.body.dataset.page||"home",$=s=>document.querySelector(s);
const art=(t,i)=>"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${(i*67+20)%360},60%,30%)'/><stop offset='1' stop-color='#1a110c'/></linearGradient></defs><rect width='300' height='180' fill='url(#g)'/><text x='150' y='115' font-size='72' text-anchor='middle'>${t}</text></svg>`);
const img=p=>p.img||art(S[p.s][2],P.indexOf(p));
const flame=c=>`<svg class="fl ${c||""}" viewBox="0 0 40 64" aria-hidden="true"><rect x="17" y="44" width="6" height="19" rx="2" fill="#8a5a2b"/><path d="M20 2c3 9 14 15 14 29a14 14 0 0 1-28 0c0-7 4-10 6-15 2 4 4 5 5 6 1-6 0-12 3-20z" fill="#ff7a1a"/><path d="M20 24c2 5 7 8 7 14a7 7 0 0 1-14 0c0-4 3-6 4-9 1 2 2 3 3 3z" fill="#ffd27a"/></svg>`;
const card=p=>`<article class="fr pc"><img src="${img(p)}" alt="${p.n}"><div><h3>${p.n}</h3><p>${p.d}</p><div class="row"><b>${p.p}</b><a class="bt" href="contact.html?p=${p.id}">شراء Buy</a></div></div></article>`;
const news=n=>N.slice(0,n||N.length).map(x=>`<div class="fr news"><small>${x[0]}</small><p>${x[1]}</p></div>`).join("");

/* الهيدر + البحث */
$("#hd").innerHTML=`<header class="top"><a class="brand" href="index.html">${flame()}<span><b>Torch Store</b><small>متجر الملفات الرقمية</small></span></a><nav>${Object.keys(S).map(k=>`<a href="${k}.html"${k==pg?' class="on"':""}>${S[k][0]}</a>`).join("")}</nav><button id="sb" aria-label="بحث">🔍</button></header><div id="sr" class="fr sr" hidden><input id="q" placeholder="ابحث عن منتج..."><div id="rs"></div></div>`;
$("#sb").onclick=()=>{const b=$("#sr");b.hidden=!b.hidden;if(!b.hidden)$("#q").focus()};
$("#q").oninput=e=>{const v=e.target.value.trim().toLowerCase();
$("#rs").innerHTML=v?(P.filter(p=>(p.n+p.d).toLowerCase().includes(v)).map(p=>`<a href="contact.html?p=${p.id}"><b>${p.n}</b><small>${S[p.s][1]}</small><i>${p.p}</i></a>`).join("")||"<p>ما لقينا منتج بهذا الاسم.</p>"):""};

/* محتوى الصفحة */
const head=S[pg]?`<h1 class="ti">${S[pg][2]} ${S[pg][0]}</h1><p class="sub">${S[pg][1]}</p>`:"";
let h="";
if(pg=="home"){
  h=`<section class="hero">${flame("big")}<h1>Torch Store</h1><p>متجر ملفات رقمية: صناديق وتاب وبلوقنات وسيرفرات جاهزة. اختر قسمك وابدأ.</p><div class="orn">❦ ✦ ❦</div></section><div class="g">${Object.keys(S).map(k=>`<a class="fr cd" href="${k}.html"><span>${S[k][2]}</span><h3>${S[k][0]}</h3><p>${S[k][1]}</p></a>`).join("")}</div><h2 class="ti">آخر الأخبار</h2>${news(3)}`;
}else if(pg=="news"){h=head+news();}
else if(pg=="publish"){
  h=head+`<div class="fr box"><p>انشر منتجك عندنا وتوصلك <b>80%</b> من كل عملية بيع، والمتجر ياخذ <b>20%</b>.</p><label>سعر منتجك بالدولار<input id="pr" type="number" min="0" value="10"></label><div class="split"><div><small>تربح أنت 80%</small><b id="o">8</b>$</div><div><small>المتجر 20%</small><b id="s">2</b>$</div></div><a class="bt" href="contact.html?p=publish">انشر منتجك</a></div>`;
}else if(pg=="contact"){
  const id=new URLSearchParams(location.search).get("p");
  const it=id=="publish"?{n:"نشر منتج جديد",p:"(نسبة 80/20)"}:P.find(x=>x.id==id)||{n:"استفسار عام",p:""};
  const msg=`مرحباً Torch Store، أريد: ${it.n} ${it.p}`.trim(),e=encodeURIComponent(msg);
  const T=[["WhatsApp","💬",C.whatsapp+"?text="+e],["Telegram","✈️",C.telegram+"?text="+e],["Discord","🎮",C.discord],["TikTok","🎵",C.tiktok]];
  h=`<h1 class="ti">راسلنا</h1><div class="fr box"><p>طلبك: <b>${it.n}</b> ${it.p}</p><p>اختر وين تحب تراسلني:</p><div class="g ct">${T.map(t=>`<a class="bt" target="_blank" rel="noopener" data-c href="${t[2]}">${t[1]} ${t[0]}</a>`).join("")}</div><small>عند الضغط تُنسخ رسالتك تلقائياً، الصقها في المحادثة.</small></div>`;
  setTimeout(()=>document.querySelectorAll("[data-c]").forEach(a=>a.addEventListener("click",()=>{try{navigator.clipboard.writeText(msg)}catch(_){}})));
}else{h=head+`<div class="g">${P.filter(p=>p.s==pg).map(card).join("")}</div>`;}
$("#m").innerHTML=h;
document.title="Torch Store"+(S[pg]?" | "+S[pg][0]:"");
if(pg=="publish"){$("#pr").oninput=e=>{const v=+e.target.value||0;$("#o").textContent=+(v*.8).toFixed(2);$("#s").textContent=+(v*.2).toFixed(2)}}

/* جمر متطاير بالخلفية */
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){
  const c=document.createElement("canvas");c.id="em";document.body.prepend(c);
  const x=c.getContext("2d");let W,H;const R=()=>{W=c.width=innerWidth;H=c.height=innerHeight};R();addEventListener("resize",R);
  const E=Array.from({length:45},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.5,v:Math.random()*.6+.2,a:Math.random()}));
  (function L(){x.clearRect(0,0,W,H);E.forEach(e=>{e.y-=e.v;e.x+=Math.sin(e.y/40)*.4;if(e.y<-5){e.y=H+5;e.x=Math.random()*W}
  x.fillStyle=`rgba(255,${120+e.a*80|0},40,${.25+e.a*.5})`;x.beginPath();x.arc(e.x,e.y,e.r,0,7);x.fill()});requestAnimationFrame(L)})();
}
