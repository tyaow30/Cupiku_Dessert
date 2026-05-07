/* ===================================================
   CUPIKU — main.js
   !! GANTI WA_NUMBER dengan nomor WhatsApp asli !!
   =================================================== */

const WA_NUMBER = "6285730650658"; // ← GANTI DI SINI

/* ===== DATA PRODUK ===== */
const products = [
  {
    id:     "matcha",
    name:   "Matcha Dream",
    desc:   "Krim matcha Jepang lembut di atas vanilla cake. Earthy, manisnya pas.",
    price:  18000,
    emoji:  "🍵",
    tag:    "Best Seller",
    bg:     "bg-lime",
    rotate: "rotate-neg",
  },
  {
    id:     "tiramisu",
    name:   "Tiramisu",
    desc:   "Mascarpone creamy + kopi pilihan + cocoa premium. Klasik, nagih.",
    price:  20000,
    emoji:  "☕",
    tag:    "Signature",
    bg:     "bg-blush",
    rotate: "rotate-pos",
  },
  {
    id:     "oreo",
    name:   "Oreo Crumble",
    desc:   "Lapisan cookies & cream dengan crumble Oreo di atasnya. Crunchy heaven.",
    price:  19000,
    emoji:  "🍪",
    tag:    "New",
    bg:     "bg-butter",
    rotate: "rotate-neg2",
  },
];

const FALLING = ["🍓","✨","💚","🍵","💗","🧁","⭐","🍃"];
const MARQUEE_ITEMS = [
  "FRESH DAILY","✦","HOMEMADE","✦","CUTE AF","✦",
  "PRE-ORDER","✦","MATCHA LOVER","✦","MADE WITH 💗","✦",
];

/* ================================================
   SPRINKLES
   ================================================ */
(function initSprinkles() {
  const wrap = document.getElementById("sprinkles");
  if (!wrap) return;
  FALLING.forEach((emoji, i) => {
    const s = document.createElement("span");
    s.className = "sprinkle";
    s.textContent = emoji;
    s.style.left            = `${(i * 13 + 5) % 95}%`;
    s.style.animationDuration = `${10 + (i % 4) * 3}s`;
    s.style.animationDelay    = `${i * 1.4}s`;
    wrap.appendChild(s);
  });
})();

/* ================================================
   MARQUEE
   ================================================ */
(function initMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;
  [0, 1].forEach(() => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:1.5rem;padding-right:1.5rem;";
    MARQUEE_ITEMS.forEach((text) => {
      const span = document.createElement("span");
      span.className   = "marquee-item";
      span.textContent = text;
      row.appendChild(span);
    });
    track.appendChild(row);
  });
})();

/* ================================================
   PRODUCTS GRID + ORDER SELECT
   ================================================ */
(function initProducts() {
  const grid     = document.getElementById("products-grid");
  const selectEl = document.getElementById("product-select");
  if (!grid || !selectEl) return;

  products.forEach((p, i) => {
    /* --- Card --- */
    const card = document.createElement("article");
    card.className = `product-card ${p.bg} ${p.rotate} reveal`;
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <span class="product-tag">${p.tag}</span>
      <div class="product-logo-sticker"><img src="assets/main-logo.png" alt="Cupiku" style="width:40px;height:40px;border-radius:50%;object-fit:contain;"></div>
      <div class="product-img-wrap">
        <!--
          Kalau sudah punya foto produk, ganti blok ini:-->
          <img src="assets/cup-${p.id}.png" alt="${p.name}"
               style="max-height:100%;object-fit:contain;
                      transition:transform .5s cubic-bezier(.34,1.56,.64,1);">
        
        <!-- <div class="product-img-placeholder">
          ${p.emoji}
          <span class="ph-label">${p.name}</span>
        </div> -->
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-bottom">
          <span class="product-price">Rp ${p.price.toLocaleString("id-ID")}</span>
          <a href="#order" class="btn-order-sm">Pesan →</a>
        </div>
      </div>
    `;
    grid.appendChild(card);

    /* --- Option --- */
    const opt = document.createElement("option");
    opt.value       = p.id;
    opt.textContent = `${p.name} — Rp ${p.price.toLocaleString("id-ID")}`;
    selectEl.appendChild(opt);
  });
})();

/* ================================================
   ORDER FORM
   ================================================ */
(function initOrderForm() {
  const selectEl = document.getElementById("product-select");
  const qtyInput = document.getElementById("qty");
  const totalEl  = document.getElementById("total-price");
  const btnOrder = document.getElementById("btn-order");
  const btnMinus = document.getElementById("qty-minus");
  const btnPlus  = document.getElementById("qty-plus");
  if (!selectEl || !qtyInput || !totalEl || !btnOrder) return;

  function getSelected() {
    return products.find((p) => p.id === selectEl.value);
  }
  function updateTotal() {
    const p   = getSelected();
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    qtyInput.value     = qty;
    totalEl.textContent = "Rp " + (p.price * qty).toLocaleString("id-ID");
  }

  selectEl.addEventListener("change", updateTotal);
  qtyInput.addEventListener("input",  updateTotal);
  btnMinus?.addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
    updateTotal();
  });
  btnPlus?.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
    updateTotal();
  });
  updateTotal();

  btnOrder.addEventListener("click", () => {
    const name = document.getElementById("name")?.value.trim();
    if (!name) { showToast("Yuk isi nama dulu ✨", "error"); return; }

    const p     = getSelected();
    const qty   = parseInt(qtyInput.value);
    const total = p.price * qty;
    const msg   =
      `Halo, saya ingin pesan Cupiku\n` +
      `Nama: ${name}\n` +
      `Produk: ${p.name}\n` +
      `Jumlah: ${qty}\n` +
      `Total: Rp ${total.toLocaleString("id-ID")}`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    showToast("Mengarahkan ke WhatsApp... 💬", "success");
  });
})();

/* ================================================
   TOAST
   ================================================ */
let toastTimer;
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className   = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ""; }, 3000);
}

/* ================================================
   NAVBAR — hamburger & active link
   ================================================ */
(function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMobile = document.getElementById("nav-mobile");
  hamburger?.addEventListener("click", () => navMobile?.classList.toggle("open"));
  document.querySelectorAll(".nav-m-link").forEach((a) => {
    a.addEventListener("click", () => navMobile?.classList.remove("open"));
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 110) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }, { passive: true });
})();

/* ================================================
   SCROLL REVEAL
   ================================================ */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
})();

/* ================================================
   FOOTER YEAR
   ================================================ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();