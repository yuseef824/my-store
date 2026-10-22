const products = [
  {
    name: "Scoreboard",
    desc: "A clean in-game scoreboard that shows players and stats.",
    tag: "Popular",
    image: "scoreboard.png",
    variants: [
      { name: "Tab", price: "$0", link: "#" },
      { name: "Scoreboard", price: "$0", link: "#" }
    ]
  },
  {
    name: "Mystery Box",
    desc: "Open a random digital reward box.",
    tag: "New",
    image: "mystery-box.png",
    variants: [
      { name: "Mystery Box", price: "$0", link: "#" }
    ]
  },
  {
    name: "Server Setup",
    desc: "Custom server programming and configuration.",
    tag: "Service",
    image: "server-setup.png",
    variants: [
      { name: "Server Setup", price: "$0", link: "#" }
    ]
  },
  {
    name: "Starter Pack",
    desc: "Everything you need to start, in one bundle.",
    tag: "Bundle",
    image: "starter-pack.png",
    variants: [
      { name: "Starter Pack", price: "$0", link: "#" }
    ]
  }
];

const grid = document.getElementById("products");

// إنشاء البطاقات
products.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${i * 0.12}s`;
  card.innerHTML = `
    <img class="cover" src="${p.image}" alt="${p.name}">
    <span class="tag">${p.tag}</span>
    <h2>${p.name}</h2>
    <p>${p.desc}</p>
    <button class="buy">Buy</button>
  `;
  card.addEventListener("click", () => openModal(p));
  grid.appendChild(card);
});

// النافذة المنبثقة
const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
  <div class="modal-box">
    <button class="close">✕</button>
    <img class="cover modal-img" alt="">
    <h2 class="modal-title"></h2>
    <p class="modal-desc"></p>
    <div class="variants"></div>
    <p class="payments">Payment: Mastercard · SuperKey</p>
  </div>
`;
document.body.appendChild(modal);

// إغلاق النافذة عند الضغط خارجها أو على زر ✕
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.classList.contains("close")) {
    modal.classList.remove("open");
  }
});

function openModal(p) {
  const img = modal.querySelector(".modal-img");
  img.src = p.image;
  img.alt = p.name;
  modal.querySelector(".modal-title").textContent = p.name;
  modal.querySelector(".modal-desc").textContent = p.desc;

  const list = modal.querySelector(".variants");
  list.innerHTML = "";
  p.variants.forEach((v) => {
    const row = document.createElement("div");
    row.className = "variant";
    row.innerHTML = `<span>${v.name} <b class="price">${v.price}</b></span>`;

    const btn = document.createElement("button");
    btn.className = "buy small";
    btn.textContent = "Buy";
    btn.addEventListener("click", () => buy(v));

    row.appendChild(btn);
    list.appendChild(row);
  });

  modal.classList.add("open");
}

// زر الشراء: يفتح رابط الدفع من مزود الدفع
function buy(variant) {
  if (variant.link === "#") {
    alert("Payment link is not set yet.");
    return;
  }
  window.open(variant.link, "_blank");
}

// زر Buy في الصفحة الرئيسية ينزل للمنتجات
document.querySelector(".btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});
/* صورة المنتج العريضة */