const products = [
  { name: "Scoreboard Tab", desc: "A clean in-game scoreboard that shows players and stats.", price: "$5", tag: "Popular" },
  { name: "Mystery Box", desc: "Open a random digital reward box.", price: "$3", tag: "New" },
  { name: "Server Setup", desc: "Custom server programming and configuration.", price: "$20", tag: "Service" },
  { name: "Starter Pack", desc: "Everything you need to start, in one bundle.", price: "$12", tag: "Bundle" }
];

const grid = document.getElementById("products");

products.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${i * 0.12}s`;
  card.innerHTML = `
    <span class="tag">${p.tag}</span>
    <h2>${p.name}</h2>
    <p>${p.desc}</p>
    <span class="price">${p.price}</span>
  `;
  grid.appendChild(card);
});

{ name: "Blog Pack", desc: "Ready-made blog templates.", price: "$8", tag: "Hot" }
