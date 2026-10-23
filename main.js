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
let me=null,role="user",uname="",list=[],ST={};
const isPub=()=>role=="admin"||role=="publisher";
const toast=t=>{const e=document.createElement("div");e.className="ts";e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2800)};
const art=(t,id)=>"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${([...String(id)].reduce((a,c)=>a+c.charCodeAt(0),0)*29)%80+110},60%,26%)'/><stop offset='1' stop-color='#0a0f0d'/></linearGradient></defs><rect width='300' height='180' fill='url(#g)'/><text x='150' y='115' font-size='72' text-anchor='middle'>${t}</text></svg>`);
const flame=c=>`<svg class="lg" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lgg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4ade80"/><stop offset="1" stop-color="#15803d"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#lgg)"/><path d="M13 14h22v6h-8v16h-6V20h-8z" fill="#04140a"/></svg>`;
const art2=()=>`<svg class="ha2" viewBox="0 0 360 320" aria-hidden="true"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a22"/><stop offset="1" stop-color="#0e1411"/></linearGradient><radialGradient id="gl"><stop offset="0" stop-color="#22c55e" stop-opacity=".45"/><stop offset="1" stop-color="#22c55e" stop-opacity="0"/></radialGradient></defs><circle cx="180" cy="170" r="150" fill="url(#gl)"/>${[0,1,2].map(i=>`<g class="sv" style="animation-delay:${-i*.8}s"><rect x="70" y="${70+i*76}" width="220" height="62" rx="14" fill="url(#sg)" stroke="#22c55e" stroke-opacity=".5"/><circle cx="98" cy="${101+i*76}" r="6" fill="#22c55e"/><circle cx="120" cy="${101+i*76}" r="6" fill="#4ade80" opacity=".6"/><rect x="170" y="${95+i*76}" width="96" height="12" rx="6" fill="#22c55e" opacity=".25"/></g>`).join("")}<rect class="cu" x="278" y="44" width="34" height="34" rx="8" fill="#22c55e"/><rect class="cu b" x="40" y="236" width="26" height="26" rx="7" fill="#4ade80" opacity=".8"/></svg>`;
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

async function authUI(){
  if(!sb)return modal("<p>الحسابات تحتاج ربط Supabase. افتح config.js وحط المفاتيح.</p>");
  if(me){
    let adm="";
    if(role=="admin"){const{data}=await sb.from("publishers").select("email");
      adm=`${acct()}<h3>الناشرون</h3><input id="re" type="email" placeholder="إيميل الناشر الجديد"><button class="bt" data-r="add">إضافة ناشر</button><div>${(data||[]).map(x=>`<p class="cmt">${esc(x.email)} <button class="dl" data-rm="${esc(x.email)}">حذف</button></p>`).join("")||'<p class="cmt">ما اكو ناشرين للحين.</p>'}</div>`}
    modal(`<h3>⚙️ الإعدادات</h3><p>${esc(me.email)} (${role=="admin"?"أدمن":role=="publisher"?"ناشر":"مستخدم"})</p><label>اسمك<input id="sn" value="${esc(uname)}"></label><button class="bt" id="sv">حفظ الاسم</button><label>كلمة سر جديدة<input id="sp" type="password" minlength="6"></label><button class="bt" id="spb">تغيير كلمة السر</button>${adm}<p></p><button class="bt" id="lo">تسجيل خروج</button>`);
    $("#lo").onclick=async()=>{await sb.auth.signOut();location.reload()};
    if($("#sa"))$("#sa").onclick=saveAcc;
    $("#sv").onclick=async()=>{const n=$("#sn").value.trim();if(!n)return;const r=await sb.from("profiles").update({name:n}).eq("id",me.id);if(r.error)return toast(r.error.message);uname=n;toast("تم الحفظ ✅")};
    $("#spb").onclick=async()=>{const r=await sb.auth.updateUser({password:$("#sp").value});toast(r.error?r.error.message:"تم تغيير كلمة السر ✅")};
    return}
  modal(`<h3>حسابك</h3><label>الاسم (للحساب الجديد)<input id="an"></label><label>الإيميل<input id="ae" type="email"></label><label>كلمة السر<input id="ap" type="password"></label><div class="row"><button class="bt" id="li">دخول</button><button class="bt" id="su">حساب جديد</button></div>`);
  const go=async up=>{const e=$("#ae").value,p=$("#ap").value;
    const r=up?await sb.auth.signUp({email:e,password:p,options:{data:{name:$("#an").value||e.split("@")[0]}}}):await sb.auth.signInWithPassword({email:e,password:p});
    if(r.error)return toast(r.error.message);
    (up&&!r.data.session)?toast("تحقق من إيميلك لتفعيل الحساب"):location.reload()};
  $("#li").onclick=()=>go(0);$("#su").onclick=()=>go(1);
}
const loadC=async id=>{const{data}=await sb.from("comments").select("*").eq("product_id",id).order("created_at");
  $("#c"+id).innerHTML=(data||[]).map(c=>`<p class="cmt"><b>${esc(c.user_name)}</b> ${esc(c.body)}</p>`).join("")+`<div class="row"><input id="i${id}" placeholder="اكتب تعليق...">&nbsp;<button class="bt" data-s="${id}">إرسال</button></div>`};


const bad=x=>!x||/YOUR|XXXX/.test(x);
const AC=[
["wa","WhatsApp","💬","9647701234567",v=>/^https?:/.test(v)?v:"https://wa.me/"+v.replace(/\D/g,""),1,"whatsapp"],
["tg","Telegram","✈️","username",v=>/^https?:/.test(v)?v:"https://t.me/"+v.replace(/^@/,""),1,"telegram"],
["dc","Discord","🎮","https://discord.gg/...",v=>/^https?:/.test(v)?v:"https://discord.com/users/"+v,0,"discord"],
["tk","TikTok","🎵","username",v=>/^https?:/.test(v)?v:"https://www.tiktok.com/@"+v.replace(/^@/,""),0,"tiktok"],
["ig","Instagram","📸","username",v=>/^https?:/.test(v)?v:"https://instagram.com/"+v.replace(/^@/,""),0],
["sc","Snapchat","👻","username",v=>/^https?:/.test(v)?v:"https://www.snapchat.com/add/"+v.replace(/^@/,""),0],
["fb","Facebook","📘","اسم الصفحة أو الرابط",v=>/^https?:/.test(v)?v:"https://facebook.com/"+v,0],
["yt","YouTube","▶️","@channel أو الرابط",v=>/^https?:/.test(v)?v:"https://youtube.com/"+(v[0]=="@"?v:"@"+v),0],
["tw","X (Twitter)","✖️","username",v=>/^https?:/.test(v)?v:"https://x.com/"+v.replace(/^@/,""),0],
["em","Email","✉️","name@example.com",v=>"mailto:"+v,2]];
const pick=a=>{const v=(ST[a[0]]||"").trim()||(CC[a[6]]||"");return bad(v)?"":a[4](v)};
async function loadST(){if(!sb)return;const r=await sb.from("store_settings").select("*").eq("id",1).maybeSingle();ST=r.data||{}}
const acct=()=>`<h3>حسابات المراسلة</h3><p class="cmt">تظهر للمشتري بعد الضغط على شراء. اترك الخانة فاضية إذا ما تريد تظهر.</p>${AC.map(a=>`<label>${a[1]}<input data-a="${a[0]}" value="${esc(ST[a[0]])}" placeholder="${a[3]}"></label>`).join("")}<button class="bt" id="sa">حفظ الحسابات</button>`;
async function saveAcc(){const v={id:1};document.querySelectorAll("[data-a]").forEach(i=>v[i.dataset.a]=i.value.trim());const r=await sb.from("store_settings").upsert(v);if(r.error)return toast(r.error.message);ST=v;toast("تم حفظ الحسابات ✅")}
function openPub(sec){modal(`<form id="pm"><h3>نشر منتج في ${S[sec][0]}</h3><input name="nm" placeholder="اسم المنتج" required><textarea name="ds" rows="3" placeholder="وصف المنتج" required></textarea><input name="pc" placeholder="السعر مثل 5$" required><label>صورة المنتج (إجبارية)<input name="im" type="file" accept="image/*" required></label><button class="bt">نشر</button></form>`);$("#pm").onsubmit=e=>doPub(e,sec)}
async function doPub(e,sec){e.preventDefault();const f=e.target,file=f.im.files[0];
  if(!file)return toast("لازم تضيف صورة للمنتج");if(file.size>3e6)return toast("الصورة كبيرة، الحد 3MB");
  const path=Date.now()+"-"+file.name.replace(/[^\w.]/g,"_");const u=await sb.storage.from("images").upload(path,file);if(u.error)return toast(u.error.message);
  const url=sb.storage.from("images").getPublicUrl(path).data.publicUrl;
  const r=await sb.from("products").insert({section:sec||f.sec.value,name:f.nm.value,descr:f.ds.value,price:f.pc.value,image_url:url,owner:me.id,owner_name:uname});
  if(r.error)return toast(r.error.message);toast("تم النشر ✅");sec?location.reload():f.reset()}
document.addEventListener("click",async e=>{
  const b=e.target.closest("button");if(!b)return;const d=b.dataset;if(d.np)return openPub(d.np);
  if(d.l){if(!me)return authUI();const on=b.classList.contains("on");
    const r=on?await sb.from("likes").delete().match({product_id:d.l,user_id:me.id}):await sb.from("likes").insert({product_id:d.l,user_id:me.id});
    if(r.error)return toast(r.error.message);b.classList.toggle("on");b.textContent="♥ "+((+b.textContent.replace(/\D/g,""))+(on?-1:1))}
  if(d.c){const x=$("#c"+d.c);x.hidden=!x.hidden;if(!x.hidden&&sb)loadC(d.c);else if(!x.hidden)x.textContent="التعليقات تحتاج Supabase."}
  if(d.s){const i=$("#i"+d.s);if(!me)return authUI();if(!i.value.trim())return;
    const r=await sb.from("comments").insert({product_id:d.s,user_id:me.id,user_name:uname,body:i.value.trim()});if(r.error)return toast(r.error.message);loadC(d.s)}
  if(d.d&&confirm("حذف المنتج؟")){const r=await sb.from("products").delete().eq("id",d.d);r.error?toast(r.error.message):location.reload()}
  if(d.r){const em=$("#re").value.trim();if(!em)return;const r=await sb.rpc("add_publisher",{e:em});toast(r.error?r.error.message:"تمت الإضافة ✅");if(!r.error)authUI()}
  if(d.rm){const r=await sb.rpc("remove_publisher",{e:d.rm});toast(r.error?r.error.message:"تم الحذف");if(!r.error)authUI()}
});

const wd=(t,o=0)=>t.split(" ").map((w,i)=>`<span style="--i:${i+o}">${w}</span>`).join(" ");
function fx(){
  const els=[...document.querySelectorAll(".cd,.pc,.news,.cta,.ti")];
  const calm=matchMedia("(prefers-reduced-motion:reduce)").matches||!("IntersectionObserver"in window);
  els.forEach(e=>{e.style.animation="none";if(!calm)e.setAttribute("data-r","")});
  if(!calm){const io=new IntersectionObserver(a=>a.forEach(x=>{if(x.isIntersecting){const t=x.target;t.classList.add("in");io.unobserve(t);setTimeout(()=>{t.removeAttribute("data-r");t.classList.remove("in")},1000)}}),{threshold:.12});els.forEach(e=>io.observe(e))}
  const st=$("#stm"),br=$("#bigring"),em=$("#em2");
  const ws=st?[...st.children]:[];
  const f=()=>{
    if(st){const r=st.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(innerHeight*.55)));ws.forEach((w,i)=>w.style.opacity=(.15+.85*Math.min(1,Math.max(0,p*ws.length*1.1-i))).toFixed(2))}
    if(br){const r=br.getBoundingClientRect();br.style.setProperty("--t",Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height))).toFixed(3))}
  };
  f();addEventListener("scroll",f,{passive:true});
  if(em&&!calm)addEventListener("pointermove",e=>{em.style.transform=`translate(${((e.clientX/innerWidth-.5)*26).toFixed(1)}px,${((e.clientY/innerHeight-.5)*26).toFixed(1)}px)`});
}
const TM=(p,ms)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(new Error("انتهت مهلة الاتصال بـ Supabase، تحقق من config.js")),ms))]);
(async()=>{
  $("#m").innerHTML='<p class="sub">جاري التحميل...</p>';
  try{await TM(who(),5000);list=await TM(prods(),5000);await TM(loadST(),5000)}catch(err){showErr(err.message);sb=null;list=P.map(x=>({...x,likes:0}))}
  const keys=Object.keys(S);
  $("#hd").innerHTML=`<header class="top"><a class="brand" href="index.html">${flame()}<span class="wm"><b>TORCH</b><i>STORE</i></span></a><nav>${keys.map(k=>`<a href="${k}.html"${k==pg?' class="on"':""}>${S[k][0]}</a>`).join("")}</nav><div class="sx"><input id="q" placeholder="ابحث عن منتج أو بلوقن أو تاب..." autocomplete="off"><div id="rs" class="rs"></div></div><button class="ib" id="ac">${me?"👤 "+esc(uname):"دخول"}</button></header>`;
  const bn=[["index.html","🏠","الرئيسية","home"],["box.html","📦","Box","box"],["quick.html","⚡","Quick","quick"],["scoreboard.html","🏆","Tab","scoreboard"]];
  const nb=document.createElement("nav");nb.className="bn";
  nb.innerHTML=bn.map(x=>`<a href="${x[0]}"${x[3]==pg?' class="on"':""}>${x[1]}<small>${x[2]}</small></a>`).join("")+`<button id="mn">☰<small>المزيد</small></button>`;document.body.append(nb);
  $("#mn").onclick=()=>modal(`<div class="g ct">${keys.map(k=>`<a class="bt" href="${k}.html">${S[k][2]} ${S[k][0]}</a>`).join("")}</div>`);
  $("#ac").onclick=authUI;
  document.addEventListener("click",e=>{if(!e.target.closest(".sx"))$("#rs").innerHTML=""});
  $("#q").oninput=e=>{const v=e.target.value.trim().toLowerCase();
    $("#rs").innerHTML=v?(list.filter(p=>(p.n+p.d).toLowerCase().includes(v)).map(p=>`<a href="contact.html?p=${p.id}"><b>${esc(p.n)}</b><small>${S[p.s]?S[p.s][1]:""}</small><i>${esc(p.p)}</i></a>`).join("")||"<p>ما لقينا منتج بهذا الاسم.</p>"):""};

  const head=S[pg]?`<h1 class="ti">${S[pg][2]} ${S[pg][0]}</h1><p class="sub">${S[pg][1]}</p>`:"";
  const none='<p class="sub">ما اكو منتجات بهذا القسم للحين.</p>';
  let h="";
  if(pg=="home"){
    h=`<section class="hero hero2"><div class="em" id="em2"><i class="ring r1"></i><i class="ring r2"></i><i class="ring r3"></i>${flame()}</div><span class="chip">● متجر Torch الرسمي</span><h1 class="kt">${wd("ملفات وأدوات")} <span class="gr" style="--i:2">جاهزة</span><br>${wd("تعطي سيرفرك الأفضلية",3)}</h1><p>صناديق وتاب وسكوربورد وبلوقنات وسيرفرات جاهزة من ناشرين معتمدين. اختر، اضغط شراء، وراسلنا.</p><div class="ha"><a class="bt" href="box.html">تصفّح المنتجات</a><a class="bt ghost" href="publish.html">انشر منتجك</a></div><div class="stats"><div><b>${list.length}</b><small>منتج</small></div><div><b>5</b><small>أقسام</small></div><div><b>80%</b><small>ربح الناشر</small></div></div></section><div class="mq"><div>${keys.concat(keys).map(k=>`<span>${S[k][2]} ${S[k][0]}</span>`).join("")}</div></div><section class="stm"><p id="stm">${"بين فكرتك وملفاتك الجاهزة فجوة، ونحن نسدّها بمنتجات جاهزة وناشرين معتمدين وتسليم سريع.".split(" ").map(w=>`<span>${w}</span>`).join(" ")}</p></section><section class="rgs"><div class="bigring" id="bigring"><i></i><i></i><b>اقفل الفجوة</b></div><a class="bt" href="box.html">ابدأ الآن</a></section><h2 class="ti">الأقسام</h2><p class="sub">اختر القسم اللي يناسبك</p><div class="g cats">${keys.map(k=>`<a class="fr cd" href="${k}.html"><span>${S[k][2]}</span><h3>${S[k][0]}</h3><p>${S[k][1]}</p><em class="go">تصفّح ←</em></a>`).join("")}</div><section class="cta"><div><h2>تريد تنشر منتجك وتربح؟</h2><p>كن ناشراً معتمداً واربح 80% من كل عملية بيع.</p><a class="bt" href="publish.html">ابدأ النشر</a></div><div class="cv">${art2()}</div></section><h2 class="ti">جديد المتجر</h2><div class="g">${list.slice(0,4).map(card).join("")||none}</div><h2 class="ti">آخر الأخبار</h2>${news(3)}`;
  }else if(pg=="news"){h=head+news();}
  else if(pg=="publish"){
    h=head+`<div class="fr box"><p>انشر منتجك عندنا وتوصلك <b>80%</b> من كل بيع، والمتجر ياخذ <b>20%</b>.</p><label>سعر منتجك بالدولار<input id="cp" type="number" min="0" value="10"></label><div class="split"><div><small>تربح أنت 80%</small><b id="o">8</b>$</div><div><small>المتجر 20%</small><b id="s">2</b>$</div></div></div>`;
    if(isPub())h+=`<form class="fr box" id="pf"><h3>انشر منتج جديد</h3><select name="sec">${["box","quick","scoreboard","blogs","server"].map(k=>`<option value="${k}">${S[k][0]}</option>`).join("")}</select><input name="nm" placeholder="اسم المنتج" required><textarea name="ds" rows="3" placeholder="وصف المنتج" required></textarea><input name="pc" placeholder="السعر مثل 5$" required><label>صورة المنتج (إجبارية)<input name="im" type="file" accept="image/*" required></label><button class="bt">نشر</button></form>`;
    else h+=`<div class="fr box"><p>${me?"النشر للناشرين المعتمدين فقط. راسلنا ونضيفك.":"سجّل دخول حتى تقدر تنشر."}</p>${me?'<a class="bt" href="contact.html?p=publish">راسلنا</a>':""}</div>`;
  }else if(pg=="contact"){
    const id=new URLSearchParams(location.search).get("p");
    const it=id=="publish"?{n:"طلب صلاحية نشر",p:""}:list.find(x=>String(x.id)==id)||{n:"استفسار عام",p:""};
    const msg=`مرحباً Torch Store، أريد: ${it.n} ${it.p}`.trim(),q=encodeURIComponent(msg);
    const T=AC.map(a=>[a[1],a[2],pick(a),a[5]]).filter(x=>x[2]).map(x=>[x[0],x[1],x[2]+(x[3]==1?(x[2].includes("?")?"&":"?")+"text="+q:x[3]==2?"?subject="+encodeURIComponent("Torch Store")+"&body="+q:"")]);
    h=`<h1 class="ti">راسلنا</h1><div class="fr box"><p>طلبك: <b>${esc(it.n)}</b> ${esc(it.p)}</p><p>اختر وين تحب تراسلني:</p><div class="g ct">${T.map(t=>`<a class="bt" target="_blank" rel="noopener" data-cp href="${t[2]}">${t[1]} ${t[0]}</a>`).join("")||"<p>حسابات المراسلة لم تُضف بعد.</p>"}</div><small>عند الضغط تُنسخ رسالتك تلقائياً، الصقها في المحادثة.</small></div>`;
    setTimeout(()=>document.querySelectorAll("[data-cp]").forEach(a=>a.addEventListener("click",()=>{try{navigator.clipboard.writeText(msg)}catch(_){}})));
  }else{h=head+(isPub()?`<button class="bt" data-np="${pg}">➕ نشر منتج في هذا القسم</button>`:"")+`<div class="g">${list.filter(p=>p.s==pg).map(card).join("")||none}</div>`;}
  $("#m").innerHTML=h;if(pg=="home")fx();
  document.title="Torch Store"+(S[pg]?" | "+S[pg][0]:"");

  if(pg=="publish"){
    $("#cp").oninput=e=>{const v=+e.target.value||0;$("#o").textContent=+(v*.8).toFixed(2);$("#s").textContent=+(v*.2).toFixed(2)};
    const f=$("#pf");if(f)f.onsubmit=e=>doPub(e);
  }
})();

/* تطبيق قابل للتثبيت */
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
