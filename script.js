const products = [
  {
    name: "Scoreboard",
    desc: "A clean in-game scoreboard that shows players and stats.",
    tag: "Popular",
    variants: [
      { name: "Tab", price: "$0" },
      { name: "Scoreboard", price: "$0" }
    ]
  },
  {
    name: "Mystery Box",
    desc: "Open a random digital reward box.",
    tag: "New",
    variants: [
      { name: "Mystery Box", price: "$0" }
    ]
  },
  {
    name: "Server Setup",
    desc: "Custom server programming and configuration.",
    tag: "Service",
    variants: [
      { name: "Server Setup", price: "$0" }
    ]
  },
  {
    name: "Starter Pack",
    desc: "Everything you need to start, in one bundle.",
    tag: "Bundle",
    variants: [
      { name: "Starter Pack", price: "$0" }
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
    <span class="tag">${p.tag}</span>
    <h2>${p.name}</h2>
    <p>${p.desc}</p>
    <span class="more">View options →</span>
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
    <h2 class="modal-title"></h2>
    <p class="modal-desc"></p>
    <div class="variants"></div>
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
  modal.querySelector(".modal-title").textContent = p.name;
  modal.querySelector(".modal-desc").textContent = p.desc;

  const list = modal.querySelector(".variants");
  list.innerHTML = "";
  p.variants.forEach((v) => {
    const row = document.createElement("div");
    row.className = "variant";
    row.innerHTML = `<span>${v.name}</span><span class="price">${v.price}</span>`;
    list.appendChild(row);
  });

  modal.classList.add("open");
}

// زر Browse Products ينزل للمنتجات
document.querySelector(".btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});