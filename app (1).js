addEventListener("error",e=>showErr(e.message));addEventListener("unhandledrejection",e=>showErr(e.reason&&e.reason.message||e.reason));
function showErr(m){const d=document.createElement("pre");d.style.cssText="color:#ffd27a;padding:1rem;white-space:pre-wrap;direction:ltr;position:relative;z-index:50";d.textContent="Error: "+m;document.body.prepend(d)}
const S={
  box:["Box","صناديق جاهزة للاستخدام","📦"],
  quick:["Quick","منتجات تسليم سريع","⚡"],
  scoreboard:["Tab Scoreboard","لوحات النتائج والتاب","🏆"],
  blogs:["Plugins","بلوقنات وإضافات جاهزة","🧩"],
  publish:["انشر منتجك","انشر منتجاتك واربح 80%","💰"],
  news:["News","أخبار المتجر","📰"],
  server:["صناعة سيرفر","نكمل لك سيرفرك بسعر واضح","🖥️"]
};
/* منتجات تجريبية تظهر فقط إذا ما ربطت Supabase */
const P=[
{id:"b1",s:"box",n:"Starter Box",d:"صندوق للمبتدئين فيه الأساسيات.",p:"5$"},
{id:"q1",s:"quick",n:"Quick Setup",d:"إعداد سريع يُسلَّم بنفس اليوم.",p:"4$"},
{id:"t1",s:"scoreboard",n:"Scoreboard Flame",d:"لوحة نتائج بتأثير ناري متحرك.",p:"7$"},
{id:"g1",s:"blogs",n:"Chat Plugin",d:"بلوقن شات منظم وقابل للتعديل.",p:"8$"},
{id:"v1",s:"server",n:"سيرفر أساسي",d:"نجهز لك سيرفر كامل بإعدادات أساسية.",p:"20$"}
];
const N=[
["2026-10-22","افتتاح Torch Store رسمياً 🔥"],
["2026-10-22","تم نشر منتج جديد: Starter Box"],
["2026-10-22","فتح باب الطلب على صناعة السيرفرات"]
];

/* ===== الكود ===== */
const $=s=>document.querySelector(s),pg=document.body.dataset.page||"home";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let sb=null;try{if(window.supabase&&typeof SB_URL!="undefined"&&!SB_URL.includes("YOUR"))sb=supabase.createClient(SB_URL,SB_KEY)}catch(err){showErr(err.message)}
const CC=typeof C!="undefined"?C:{};
let me=null,role="user",uname="",list=[];
const isPub=()=>role=="admin"||role=="publisher";
const toast=t=>{const e=document.createElement("div");e.className="ts";e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2800)};
const art=(t,id)=>"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${([...String(id)].reduce((a,c)=>a+c.charCodeAt(0),0)*67)%360},60%,30%)'/><stop offset='1' stop-color='#1a110c'/></linearGradient></defs><rect width='300' height='180' fill='url(#g)'/><text x='150' y='115' font-size='72' text-anchor='middle'>${t}</text></svg>`);
const flame=c=>`<svg class="fl ${c||""}" viewBox="0 0 40 64" aria-hidden="true"><rect x="17" y="44" width="6" height="19" rx="2" fill="#8a5a2b"/><path d="M20 2c3 9 14 15 14 29a14 14 0 0 1-28 0c0-7 4-10 6-15 2 4 4 5 5 6 1-6 0-12 3-20z" fill="#ff7a1a"/><path d="M20 24c2 5 7 8 7 14a7 7 0 0 1-14 0c0-4 3-6 4-9 1 2 2 3 3 3z" fill="#ffd27a"/></svg>`;
const modal=h=>{let m=$("#md");if(!m){m=document.createElement("div");m.id="md";m.className="md";m.onclick=e=>{if(e.target==m)m.hidden=true};document.body.append(m)}m.innerHTML=`<div class="fr box">${h}</div>`;m.hidden=false;return m};

async function who(){
  if(!sb)return;
  const{data}=await sb.auth.getSession();me=data.session?.user||null;
  if(me){const r=await sb.from("profiles").select("name,role").eq("id",me.id).maybeSingle();role=r.data?.role||"user";uname=r.data?.name||me.email}
}
async function prods(){
  if(!sb)return P.map(x=>({...x,likes:0}));
  const[a,b]=await Promise.all([sb.from("products").select("*").order("created_at",{ascending:false}),sb.from("likes").select("product_id,user_id")]);
  return(a.data||[]).map(r=>{const l=(b.data||[]).filter(x=>x.product_id==r.id);
    return{id:r.id,s:r.section,n:r.name,d:r.descr,p:r.price,img:r.image_url,by:r.owner_name,own:r.owner,likes:l.length,liked:!!me&&l.some(x=>x.user_id==me.id)}});
}
const card=p=>`<article class="fr pc"><img src="${p.img?esc(p.img):art(S[p.s]?S[p.s][2]:"🔥",p.id)}" alt="${esc(p.n)}"><div><h3>${esc(p.n)}</h3>${p.by?`<small>بواسطة ${esc(p.by)}</small>`:""}<p>${esc(p.d)}</p><div class="row"><b>${esc(p.p)}</b><span><button class="lk${p.liked?" on":""}" data-l="${p.id}">♥ ${p.likes||0}</button> <button class="cm" data-c="${p.id}">💬</button>${me&&(role=="admin"||p.own==me.id)?` <button class="dl" data-d="${p.id}">🗑</button>`:""}</span></div><a class="bt" href="contact.html?p=${p.id}">شراء Buy</a><div class="cb" id="c${p.id}" hidden></div></div></article>`;
const news=n=>N.slice(0,n||N.length).map(x=>`<div class="fr news"><small>${x[0]}</small><p>${esc(x[1])}</p></div>`).join("");

function authUI(){
  if(!sb)return modal("<p>الحسابات تحتاج ربط Supabase. افتح config.js وحط المفاتيح.</p>");
  if(me){modal(`<p>أهلاً <b>${esc(uname)}</b> (${role})</p><button class="bt" id="lo">تسجيل خروج</button>`);$("#lo").onclick=async()=>{await sb.auth.signOut();location.reload()};return}
  modal(`<h3>حسابك</h3><label>الاسم (للحساب الجديد)<input id="an"></label><label>الإيميل<input id="ae" type="email"></label><label>كلمة السر<input id="ap" type="password"></label><div class="row"><button class="bt" id="li">دخول</button><button class="bt" id="su">حساب جديد</button></div>`);
  const go=async up=>{const e=$("#ae").value,p=$("#ap").value;
    const r=up?await sb.auth.signUp({email:e,password:p,options:{data:{name:$("#an").value||e.split("@")[0]}}}):await sb.auth.signInWithPassword({email:e,password:p});
    if(r.error)return toast(r.error.message);
    (up&&!r.data.session)?toast("تحقق من إيميلك لتفعيل الحساب"):location.reload()};
  $("#li").onclick=()=>go(0);$("#su").onclick=()=>go(1);
}
const loadC=async id=>{const{data}=await sb.from("comments").select("*").eq("product_id",id).order("created_at");
  $("#c"+id).innerHTML=(data||[]).map(c=>`<p class="cmt"><b>${esc(c.user_name)}</b> ${esc(c.body)}</p>`).join("")+`<div class="row"><input id="i${id}" placeholder="اكتب تعليق...">&nbsp;<button class="bt" data-s="${id}">إرسال</button></div>`};

document.addEventListener("click",async e=>{
  const b=e.target.closest("button");if(!b)return;const d=b.dataset;
  if(d.l){if(!me)return authUI();const on=b.classList.contains("on");
    const r=on?await sb.from("likes").delete().match({product_id:d.l,user_id:me.id}):await sb.from("likes").insert({product_id:d.l,user_id:me.id});
    if(r.error)return toast(r.error.message);b.classList.toggle("on");b.textContent="♥ "+((+b.textContent.replace(/\D/g,""))+(on?-1:1))}
  if(d.c){const x=$("#c"+d.c);x.hidden=!x.hidden;if(!x.hidden&&sb)loadC(d.c);else if(!x.hidden)x.textContent="التعليقات تحتاج Supabase."}
  if(d.s){const i=$("#i"+d.s);if(!me)return authUI();if(!i.value.trim())return;
    const r=await sb.from("comments").insert({product_id:d.s,user_id:me.id,user_name:uname,body:i.value.trim()});if(r.error)return toast(r.error.message);loadC(d.s)}
  if(d.d&&confirm("حذف المنتج؟")){const r=await sb.from("products").delete().eq("id",d.d);r.error?toast(r.error.message):location.reload()}
  if(d.r){const r=await sb.rpc("set_role",{e:$("#re").value.trim(),r:d.r});toast(r.error?r.error.message:"تم ✅")}
});

const TM=(p,ms)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error("انتهت مهلة الاتصال بـ Supabase، تحقق من config.js")),ms))]);
(async()=>{
  $("#m").innerHTML='<p class="sub">جاري التحميل...</p>';
  try{await TM(who(),5000);list=await TM(prods(),5000)}catch(err){showErr(err.message);sb=null;list=P.map(x=>({...x,likes:0}))}
  const keys=Object.keys(S);
  $("#hd").innerHTML=`<header class="top"><a class="brand" href="index.html">${flame()}<span><b>Torch Store</b><small>متجر الملفات الرقمية</small></span></a><nav>${keys.map(k=>`<a href="${k}.html"${k==pg?' class="on"':""}>${S[k][0]}</a>`).join("")}</nav><button class="ib" id="sb" aria-label="بحث">🔍</button><button class="ib" id="ac">${me?"👤 "+esc(uname):"دخول"}</button></header><div id="sr" class="fr sr" hidden><input id="q" placeholder="ابحث عن منتج..."><div id="rs"></div></div>`;
  const bn=[["index.html","🏠","الرئيسية","home"],["box.html","📦","Box","box"],["quick.html","⚡","Quick","quick"],["scoreboard.html","🏆","Tab","scoreboard"]];
  const nb=document.createElement("nav");nb.className="bn";
  nb.innerHTML=bn.map(x=>`<a href="${x[0]}"${x[3]==pg?' class="on"':""}>${x[1]}<small>${x[2]}</small></a>`).join("")+`<button id="mn">☰<small>المزيد</small></button>`;document.body.append(nb);
  $("#mn").onclick=()=>modal(`<div class="g ct">${keys.map(k=>`<a class="bt" href="${k}.html">${S[k][2]} ${S[k][0]}</a>`).join("")}</div>`);
  $("#ac").onclick=authUI;
  $("#sb").onclick=()=>{const b=$("#sr");b.hidden=!b.hidden;if(!b.hidden)$("#q").focus()};
  $("#q").oninput=e=>{const v=e.target.value.trim().toLowerCase();
    $("#rs").innerHTML=v?(list.filter(p=>(p.n+p.d).toLowerCase().includes(v)).map(p=>`<a href="contact.html?p=${p.id}"><b>${esc(p.n)}</b><small>${S[p.s]?S[p.s][1]:""}</small><i>${esc(p.p)}</i></a>`).join("")||"<p>ما لقينا منتج بهذا الاسم.</p>"):""};

  const head=S[pg]?`<h1 class="ti">${S[pg][2]} ${S[pg][0]}</h1><p class="sub">${S[pg][1]}</p>`:"";
  const none='<p class="sub">ما اكو منتجات بهذا القسم للحين.</p>';
  let h="";
  if(pg=="home"){
    h=`<section class="hero">${flame("big")}<h1>Torch Store</h1><p>متجر ملفات رقمية: صناديق وتاب وبلوقنات وسيرفرات جاهزة. اختر قسمك وابدأ.</p><div class="orn">❦ ✦ ❦</div></section><div class="g">${keys.map(k=>`<a class="fr cd" href="${k}.html"><span>${S[k][2]}</span><h3>${S[k][0]}</h3><p>${S[k][1]}</p></a>`).join("")}</div><h2 class="ti">جديد المتجر</h2><div class="g">${list.slice(0,4).map(card).join("")||none}</div><h2 class="ti">آخر الأخبار</h2>${news(3)}`;
  }else if(pg=="news"){h=head+news();}
  else if(pg=="publish"){
    h=head+`<div class="fr box"><p>انشر منتجك عندنا وتوصلك <b>80%</b> من كل بيع، والمتجر ياخذ <b>20%</b>.</p><label>سعر منتجك بالدولار<input id="cp" type="number" min="0" value="10"></label><div class="split"><div><small>تربح أنت 80%</small><b id="o">8</b>$</div><div><small>المتجر 20%</small><b id="s">2</b>$</div></div></div>`;
    if(isPub())h+=`<form class="fr box" id="pf"><h3>انشر منتج جديد</h3><select name="sec">${["box","quick","scoreboard","blogs","server"].map(k=>`<option value="${k}">${S[k][0]}</option>`).join("")}</select><input name="nm" placeholder="اسم المنتج" required><textarea name="ds" rows="3" placeholder="وصف المنتج" required></textarea><input name="pc" placeholder="السعر مثل 5$" required><label>صورة المنتج<input name="im" type="file" accept="image/*"></label><button class="bt">نشر</button></form>`;
    else h+=`<div class="fr box"><p>${me?"حسابك مو ناشر حالياً. راسلنا ونضيفك كناشر.":"سجّل دخول حتى تقدر تنشر."}</p>${me?'<a class="bt" href="contact.html?p=publish">راسلنا</a>':""}</div>`;
    if(role=="admin")h+=`<div class="fr box"><h3>إدارة الناشرين</h3><input id="re" type="email" placeholder="إيميل الشخص"><div class="row"><button class="bt" data-r="publisher">اجعله ناشر</button><button class="bt" data-r="user">أزل الصلاحية</button></div></div>`;
  }else if(pg=="contact"){
    const id=new URLSearchParams(location.search).get("p");
    const it=id=="publish"?{n:"طلب صلاحية نشر",p:""}:list.find(x=>String(x.id)==id)||{n:"استفسار عام",p:""};
    const msg=`مرحباً Torch Store، أريد: ${it.n} ${it.p}`.trim(),q=encodeURIComponent(msg);
    const T=[["WhatsApp","💬",CC.whatsapp+"?text="+q],["Telegram","✈️",CC.telegram+"?text="+q],["Discord","🎮",CC.discord],["TikTok","🎵",CC.tiktok]];
    h=`<h1 class="ti">راسلنا</h1><div class="fr box"><p>طلبك: <b>${esc(it.n)}</b> ${esc(it.p)}</p><p>اختر وين تحب تراسلني:</p><div class="g ct">${T.map(t=>`<a class="bt" target="_blank" rel="noopener" data-cp href="${t[2]}">${t[1]} ${t[0]}</a>`).join("")}</div><small>عند الضغط تُنسخ رسالتك تلقائياً، الصقها في المحادثة.</small></div>`;
    setTimeout(()=>document.querySelectorAll("[data-cp]").forEach(a=>a.addEventListener("click",()=>{try{navigator.clipboard.writeText(msg)}catch(_){}})));
  }else{h=head+`<div class="g">${list.filter(p=>p.s==pg).map(card).join("")||none}</div>`;}
  $("#m").innerHTML=h;
  document.title="Torch Store"+(S[pg]?" | "+S[pg][0]:"");

  if(pg=="publish"){
    $("#cp").oninput=e=>{const v=+e.target.value||0;$("#o").textContent=+(v*.8).toFixed(2);$("#s").textContent=+(v*.2).toFixed(2)};
    const f=$("#pf");if(f)f.onsubmit=async e=>{e.preventDefault();const file=f.im.files[0];let url=null;
      if(file){const path=Date.now()+"-"+file.name.replace(/[^\w.]/g,"_");const u=await sb.storage.from("images").upload(path,file);if(u.error)return toast(u.error.message);url=sb.storage.from("images").getPublicUrl(path).data.publicUrl}
      const r=await sb.from("products").insert({section:f.sec.value,name:f.nm.value,descr:f.ds.value,price:f.pc.value,image_url:url,owner:me.id,owner_name:uname});
      if(r.error)return toast(r.error.message);toast("تم النشر ✅");f.reset()};
  }
})();

/* جمر بالخلفية */
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){
  const c=document.createElement("canvas");c.id="em";document.body.prepend(c);
  const x=c.getContext("2d");let W,H;const R=()=>{W=c.width=innerWidth;H=c.height=innerHeight};R();addEventListener("resize",R);
  const E=Array.from({length:45},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.5,v:Math.random()*.6+.2,a:Math.random()}));
  (function L(){x.clearRect(0,0,W,H);E.forEach(e=>{e.y-=e.v;e.x+=Math.sin(e.y/40)*.4;if(e.y<-5){e.y=H+5;e.x=Math.random()*W}
  x.fillStyle=`rgba(255,${120+e.a*80|0},40,${.25+e.a*.5})`;x.beginPath();x.arc(e.x,e.y,e.r,0,7);x.fill()});requestAnimationFrame(L)})();
}
/* تطبيق قابل للتثبيت */
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
