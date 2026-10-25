// ─── Avalea · HTML + CSS + JavaScript puro ───────────────────────
const WHATSAPP = "573212412532";

// Fotos
const IMG = (n) => "img/" + n;
const ST = ["st1","st2","st3","st4","st5","st6"].map(n => IMG(n + ".jpg"));
const SL = ["sl1","sl2","sl3","sl4"].map(n => IMG(n + ".jpg"));

// Foto de cada vela según el tamaño (el Mini usa la foto de su vela hasta que lleguen las fotos mini reales)
const PH = {
  niebla:     { xs: IMG("niebla.jpg"), sm: IMG("niebla.jpg"), md: IMG("niebla.jpg"), lg: IMG("niebla.jpg") },
  palenquera: { xs: IMG("pal_sm.jpg"), sm: IMG("pal_sm.jpg"), md: IMG("pal_md.jpg"), lg: IMG("pal_lg.jpg") },
  cacao:      { xs: IMG("cacao.jpg"), sm: IMG("cacao.jpg"),  md: IMG("cacao.jpg"),  lg: IMG("cacao.jpg") },
  noches:     { xs: IMG("noches.jpg"), sm: IMG("noches.jpg"), md: IMG("noches.jpg"), lg: IMG("noches.jpg") }
};
// En el catálogo solo se ve la foto grande
const CA = { niebla: IMG("niebla.jpg"), palenquera: IMG("pal_lg.jpg"), cacao: IMG("cacao.jpg"), noches: IMG("noches.jpg") };

const SIZES = [
  { key: "xs", label: "Mini",    g: 70,  hours: "12–15 hrs" },
  { key: "sm", label: "Pequeño", g: 120, hours: "20–25 hrs" },
  { key: "md", label: "Mediano", g: 220, hours: "35–40 hrs" },
  { key: "lg", label: "Grande",  g: 277, hours: "45–50 hrs" }
];

const PRODUCTS = [
  { id: 1, name: "Niebla del Páramo", slug: "niebla", region: "Boyacá · Páramo de Sumapaz", category: "Cítrica · Verde", stamp: "1830", number: "01", notes: ["Bergamota","Limón","Hoja Verde","Almizcle Blanco"], description: "Del silencio de los frailejones y la niebla eterna del páramo colombiano. Una fragancia que celebra la resiliencia: la tierra que resiste, que guarda, que renace.", prices: { xs: 28000, sm: 42000, md: 65000, lg: 85000 } },
  { id: 2, name: "La Palenquera", slug: "palenquera", region: "Bolívar · Cartagena de Indias", category: "Frutal · Tropical", stamp: "1845", number: "02", notes: ["Corozo","Coco","Cítrico"], description: "Inspirada en la elegancia de las palenqueras de la Ciudad Amurallada, esta fragancia celebra la abundancia del Caribe: limonada de corozo, coco y frutas tropicales que llenan el aire de frescura y luz.", prices: { xs: 28000, sm: 42000, md: 65000, lg: 85000 } },
  { id: 3, name: "Cacao de la Sierra", slug: "cacao", region: "Sierra Nevada · Edición Especial", category: "Gourmand · Maderosa", stamp: "1924", number: "03", notes: ["Cacao","Limón","Madera"], description: "En las faldas de la Sierra Nevada nace el cacao que transforma nuestra tierra. Un homenaje a las manos que siembran esperanza y convierten cada semilla en un legado de paz.", prices: { xs: 28000, sm: 42000, md: 65000, lg: 85000 } },
  { id: 4, name: "Noches de Cartagena", slug: "noches", region: "Bolívar · Ciudad Amurallada", category: "Ámbar · Oriental", stamp: "1928", number: "04", notes: ["Ámbar","Vainilla Francesa","Sándalo","Tonka"], description: "La noche desciende sobre la Ciudad Amurallada y Cartagena se convierte en misterio. Brisa cálida, luces doradas, calles de piedra. Una fragancia para las noches que no se olvidan.", prices: { xs: 28000, sm: 42000, md: 65000, lg: 85000 } }
];

const RITUAL = [
  { n: "01", t: "La Primera Quema", x: "Permite que la cera derrita uniformemente hasta los bordes. Esto evita el túnel y prolonga la vida de tu vela." },
  { n: "02", t: "La Mecha",         x: "Recorta la mecha a 5 mm antes de cada encendido. Una mecha bien recortada quema limpio y sin humo." },
  { n: "03", t: "El Espacio",       x: "Coloca tu vela lejos de corrientes y fuentes de aire. Que la llama danse, pero quieta." },
  { n: "04", t: "El Reposo",        x: "Disfruta entre 2 y 4 horas, no más. Apaga con tapa o apagavelas para preservar el aroma." }
];

const fmt = (n) => "$" + n.toLocaleString("es-CO");
const $app = document.getElementById("app");
let timer = null; // intervalo del carrusel

// WhatsApp: botón flotante y enlaces del footer (data-wa = mensaje)
const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
document.getElementById("wa").href = waLink("Hola Avalea, me interesa su colección");
document.querySelectorAll("[data-wa]").forEach(a => a.href = waLink(a.dataset.wa));

const CHECKOUT_URL = "https://checkout.wompi.co/method";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ─── Carrito ─────────────────────────────────────────────────────
// Cada ítem: { slug, size, qty }. Se guarda en el navegador para que no se pierda al recargar.
let cart = [];
try { cart = JSON.parse(localStorage.getItem("avalea-cart")) || []; } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem("avalea-cart", JSON.stringify(cart)); } catch (e) {} };

const $co = document.getElementById("co"), $cd = document.getElementById("cd");
const $body = document.getElementById("cd-body"), $foot = document.getElementById("cd-foot");
const $count = document.getElementById("cart-count"), $toast = document.getElementById("toast");
let toastTimer = null, lastFocus = null;

const toast = (m) => {
  $toast.textContent = m; $toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => $toast.classList.remove("show"), 2200);
};
const lineTotal = (it) => PRODUCTS.find(p => p.slug === it.slug).prices[it.size] * it.qty;
const cartTotal = () => cart.reduce((s, it) => s + lineTotal(it), 0);
const cartCount = () => cart.reduce((s, it) => s + it.qty, 0);

function addToCart(slug, size, qty) {
  const ex = cart.find(it => it.slug === slug && it.size === size);
  if (ex) ex.qty += qty; else cart.push({ slug, size, qty });
  saveCart(); renderCart();
}
function setQty(i, q) {
  if (q < 1) cart.splice(i, 1); else cart[i].qty = q;
  saveCart(); renderCart();
}

function renderCart() {
  const n = cartCount();
  $count.textContent = n; $count.hidden = n === 0;
  if (!cart.length) {
    $body.innerHTML = `<div class="cd-em"><b>◇</b><p>Tu carrito está vacío</p></div>`;
    $foot.hidden = true; return;
  }
  $body.innerHTML = cart.map((it, i) => {
    const p = PRODUCTS.find(x => x.slug === it.slug), sd = SIZES.find(s => s.key === it.size);
    return `
    <div class="cd-it">
      <div class="cd-stp"><img src="${PH[it.slug][it.size]}" alt=""></div>
      <div class="cd-ii">
        <div class="cd-in">${p.name}</div>
        <div class="cd-is">${sd.label} · ${sd.g} g</div>
        <div class="cd-ic">
          <button class="qb" data-i="${i}" data-d="-1" type="button" aria-label="Quitar una unidad de ${p.name}">−</button>
          <span class="cd-iq" aria-label="Cantidad">${it.qty}</span>
          <button class="qb" data-i="${i}" data-d="1" type="button" aria-label="Agregar una unidad de ${p.name}">+</button>
          <button class="cd-ir" data-i="${i}" data-d="x" type="button">Eliminar</button>
        </div>
      </div>
      <div class="cd-ip">${fmt(lineTotal(it))}</div>
    </div>`;
  }).join("");
  $foot.hidden = false;
  $foot.innerHTML = `
    <div class="cd-tr"><span class="cd-tl">Total</span><span class="cd-tv">${fmt(cartTotal())}</span></div>
    <a class="btn bgd cd-cb" href="${CHECKOUT_URL}">Pagar</a>`;
}
$body.addEventListener("click", (e) => {
  const b = e.target.closest("[data-i]"); if (!b) return;
  const i = Number(b.dataset.i);
  setQty(i, b.dataset.d === "x" ? 0 : cart[i].qty + Number(b.dataset.d));
});

function openCart() {
  lastFocus = document.activeElement;
  $co.classList.add("open"); $cd.classList.add("open"); $cd.setAttribute("aria-hidden", "false");
  document.getElementById("cd-close").focus();
}
function closeCart() {
  if (!$cd.classList.contains("open")) return;
  $co.classList.remove("open"); $cd.classList.remove("open"); $cd.setAttribute("aria-hidden", "true");
  if (lastFocus) lastFocus.focus();
}
document.getElementById("cart-open").addEventListener("click", openCart);
document.getElementById("cd-close").addEventListener("click", closeCart);
$co.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $cd.classList.contains("open")) closeCart(); });

// ─── Secciones (cada una devuelve HTML) ──────────────────────────
const stampsBand = () => {
  const items = [...ST, ...ST, ...ST, ...ST];
  return `<div class="stamps-band"><div class="stamps-track">${items.map(s => `<img src="${s}" alt="">`).join("")}</div></div>`;
};

const hero = () => `
<section class="hero">
  <img class="hero-ibg" src="${IMG("hero_bg.jpg")}" alt="">
  <video autoplay loop muted playsinline src="${IMG("hero_video.mp4")}" class="hero-vid"></video>
  <div class="hvig"></div><div class="hgr"></div>
  <div class="hct">
    <div>
      <div class="hlb">Primera Edición · MMXXVI</div>
      <h1 class="ht">Aromas<br><em>que viajan</em><br>como cartas.</h1>
      <p class="hsub">Una colección filatélica de velas artesanales inspiradas en los paisajes, personajes y memorias de Colombia.</p>
      <div class="hbtns">
        <a class="btn bgd" href="#/coleccion">Ver la Colección</a>
        <a class="btn bot" href="#/historia">Nuestra historia</a>
      </div>
    </div>
    <div class="hr"><img src="${IMG("logo.png")}" alt=""><div class="hr-b">C O L O M B I A</div><div class="hr-e">N.º 01 · IV Piezas</div></div>
  </div>
  <div class="scr"><div></div><span>Explorar</span></div>
</section>`;

const features = () => `
<div class="feat"><span>Cera de soja 100%</span><span>Mecha de algodón</span><span>40–50 hrs de quemado</span><span>Hecho a mano · Bogotá</span><span>Edición numerada</span></div>`;

const productCard = (p) => `
<a class="pc" href="#/producto/${p.slug}">
  <img class="pc-img" src="${CA[p.slug]}" alt="${p.name}">
  <div class="pc-b">
    <div class="pc-top"><span class="pc-num">N.º ${p.number} / 04</span><span class="pc-yr">${p.stamp}</span></div>
    <div class="pc-cat">${p.category}</div>
    <h3 class="pc-name">${p.name}</h3>
    <div class="pc-reg">${p.region}</div>
    <div class="pc-dv"></div>
    <div class="pc-nt">${p.notes.join(" · ")}</div>
    <div class="pc-ft"><div><div class="pc-pl">Desde</div><div class="pc-pr">${fmt(p.prices.xs)}</div></div><span class="pc-cta">Ver Detalle →</span></div>
  </div>
</a>`;

const collectionSec = () => `
<section class="sec">
  <div class="slb">La Colección</div>
  <h2 class="st">Cuatro destinos,<br><em>cuatro memorias.</em></h2>
  <p class="sd">Cada vela es una pequeña carta sellada. Cera de soja vegetal, mecha de algodón puro y aromas que evocan los rincones más bellos de Colombia.</p>
  <div class="pgr">${PRODUCTS.map(productCard).join("")}</div>
</section>`;

const slidesSection = () => `
<section class="slides-sec">
  <div class="carousel3d" id="car">${SL.map((s, i) => `<div class="car-slide"><img src="${s}" alt="Tarjeta ${i + 1} de 4 de la colección Avalea"></div>`).join("")}</div>
  <div class="slides-dots" id="dots">${SL.map(() => `<button class="sdot" aria-label="Ver tarjeta"></button>`).join("")}</div>
</section>`;

const cartasSec = () => `
<section class="crt"><div class="crt-in">
  <div class="crt-ph"><img src="${IMG("carta_manana.jpg")}" alt="Sobre kraft con tarjetas en blanco y una pluma dorada sobre una mesa de madera" loading="lazy"></div>
  <div class="crt-tx">
    <div class="slb">Cartas que encienden</div>
    <h2 class="st">Velas que iluminan<br><em>tu historia.</em></h2>
    <p class="sd" style="margin-bottom:32px">Cada aroma llega como una carta: escrito con calma, sellado con cuidado y pensado para quien lo recibe. Elige el destino y deja que la luz cuente el resto.</p>
    <a class="btn bdk" href="#/coleccion">Ver la Colección</a>
  </div>
</div></section>`;

const atelierSec = () => `
<section class="atl" id="historia"><div class="atl-in">
  <div>
    <h2 class="st">Cada vela,<br><em>una carta de amor</em><br>a Colombia.</h2>
  </div>
  <div>
    <p class="atl-d">Avalea nació en un taller pequeño en Bogotá, donde una colección de estampillas heredadas inspiró la idea: ¿y si pudiéramos enviar un aroma como quien envía una carta?</p>
    <p class="atl-d">Cada pieza se elabora a mano con cera de soja vegetal, mecha de algodón puro y aceites esenciales seleccionados uno a uno. Lo lento, lo hecho con tiempo, es nuestro lujo.</p>
    <div class="atl-sts">
      <div><div class="atl-sv">04</div><div class="atl-sl">Estampillas</div></div>
      <div><div class="atl-sv">100%</div><div class="atl-sl">Cera de soja</div></div>
      <div><div class="atl-sv">50h</div><div class="atl-sl">Hasta de quema</div></div>
    </div>
  </div>
</div></section>`;

const ritualSec = () => `
<section class="sec care">
  <div class="slb">El Ritual</div>
  <h2 class="st">Cómo cuidar<br><em>tu vela.</em></h2>
  <div class="rit-g">${RITUAL.map((r, i) => `
    <div class="rit-c">
      <img class="${i % 2 === 0 ? "rit-stamp-tr" : "rit-stamp-br"}" src="${ST[i % 6]}" alt="">
      <div class="rit-n">${r.n}</div><div class="rit-ct">${r.t}</div><div class="rit-cx">${r.x}</div>
    </div>`).join("")}
  </div>
</section>`;

const nocheBand = () => `
<section class="nb">
  <img class="nb-img" src="${IMG("noche_luna.jpg")}" alt="Vela negra Noches de Cartagena sobre la muralla, con la ciudad iluminada al fondo" loading="lazy">
  <div class="nb-ov"></div>
  <div class="nb-ct"><div class="nb-box">
    <h2 class="st">Noches de<br><em>Cartagena</em></h2>
    <p class="nb-d">Brisa cálida, luces doradas, calles de piedra. Una vela para las noches que no se olvidan.</p>
    <a class="btn bgd" href="#/producto/noches">Conocer esta vela</a>
  </div></div>
</section>`;

const collectionPage = () => `
<div class="coll-header">
  <div class="slb" style="justify-content:center">La Colección</div>
  <h1 class="st" style="text-align:center">Cuatro destinos,<br><em>cuatro memorias.</em></h1>
</div>
<div style="padding:0 48px 80px;max-width:1200px;margin:0 auto"><div class="pgr">${PRODUCTS.map(productCard).join("")}</div></div>`;

const productPage = (p, size, qty) => {
  const sd = SIZES.find(s => s.key === size);
  const total = p.prices[size] * qty;
  return `
<section class="pd">
  <div class="pd-v">
    <div class="pd-vl">N.° ${p.number} / Primera Edición</div>
    <div class="pd-seal"><div class="pd-st">${p.region.split("·")[0].trim()}<br>${p.stamp}</div></div>
    <div class="zoom-container" id="zoom"><img class="zoom-img" id="zimg" src="${PH[p.slug][size]}" alt="${p.name}"></div>
  </div>
  <div class="pd-i">
    <div class="pd-cat">${p.category}</div>
    <h1 class="pd-nm">${p.name}</h1>
    <div class="pd-rg">${p.region}</div>
    <div class="pd-sep"></div>
    <p class="pd-ds">${p.description}</p>
    <div class="pd-nlb">Notas Olfativas</div>
    <div class="pd-nl">${p.notes.map(n => `<span class="pd-nc">${n}</span>`).join("")}</div>
    <div class="pd-slb"><span>Selecciona Tamaño</span><span>Quema: ${sd.hours}</span></div>
    <div class="pd-szs">${SIZES.map(s => `
      <button class="pd-sz ${s.key === size ? "act" : ""}" data-size="${s.key}">
        <div class="pd-szw">${s.g}<small> g</small></div><div class="pd-szl">${s.label}</div><div class="pd-szp">${fmt(p.prices[s.key])}</div>
      </button>`).join("")}</div>
    <div class="pd-ar">
      <div class="pd-qt"><button data-q="-1">−</button><span>${qty}</span><button data-q="1">+</button></div>
      <button class="btn bgd pd-ab" id="add" type="button"><span>Añadir al Carrito</span><span>${fmt(total)}</span></button>
    </div>
    <div class="pd-dt">
      <div><div class="pd-dl">Material</div><div class="pd-dv2">Cera de soja 100%</div></div>
      <div><div class="pd-dl">Mecha</div><div class="pd-dv2">Algodón puro</div></div>
      <div><div class="pd-dl">Origen</div><div class="pd-dv2">Bogotá, Colombia</div></div>
      <div><div class="pd-dl">Edición</div><div class="pd-dv2">Numerada · 2026</div></div>
    </div>
  </div>
</section>`;
};

// ─── Comportamientos ─────────────────────────────────────────────
function startCarousel() {
  const slides = [...document.querySelectorAll(".car-slide")];
  const dots = [...document.querySelectorAll(".sdot")];
  if (!slides.length) return;
  let idx = 0;
  const paint = () => {
    const n = slides.length, prev = (idx - 1 + n) % n, next = (idx + 1) % n;
    slides.forEach((el, i) => {
      el.className = "car-slide " + (i === idx ? "car-active" : i === prev ? "car-prev" : i === next ? "car-next" : "car-hidden");
    });
    dots.forEach((d, i) => d.classList.toggle("act", i === idx));
  };
  dots.forEach((d, i) => d.addEventListener("click", () => { idx = i; paint(); }));
  paint();
  if (!reduceMotion) timer = setInterval(() => { idx = (idx + 1) % slides.length; paint(); }, 5000);
}

function startZoom() {
  const box = document.getElementById("zoom");
  if (!box) return;
  const src = document.getElementById("zimg").src;
  let circle = null;
  box.addEventListener("mouseenter", () => {
    circle = document.createElement("div");
    circle.className = "zoom-circle";
    circle.style.backgroundImage = `url(${src})`;
    box.appendChild(circle);
  });
  box.addEventListener("mousemove", (e) => {
    if (!circle) return;
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
    circle.style.left = x + "%"; circle.style.top = y + "%";
    circle.style.backgroundPosition = `${x}% ${y}%`;
  });
  box.addEventListener("mouseleave", () => { if (circle) { circle.remove(); circle = null; } });
}

function showProduct(p, size, qty) {
  $app.innerHTML = backBar("#/coleccion", "Volver a la Colección") + productPage(p, size, qty) + ritualSec();
  startZoom();
  $app.querySelectorAll("[data-size]").forEach(b => b.addEventListener("click", () => showProduct(p, b.dataset.size, qty)));
  document.getElementById("add").addEventListener("click", () => {
    addToCart(p.slug, size, qty);
    toast(`${p.name} agregada`);
    showProduct(p, size, 1);
  });
  $app.querySelectorAll("[data-q]").forEach(b => b.addEventListener("click", () => showProduct(p, size, Math.max(1, qty + Number(b.dataset.q)))));
}

// Botón "Volver" arriba a la izquierda (en todas las páginas menos el inicio)
const backBar = (href, label) => `<div class="back-bar"><a class="back-btn" href="${href}">← ${label}</a></div>`;

// ─── Rutas (con # para que funcione en Live Server y GitHub Pages) ─
function route() {
  clearInterval(timer);
  const parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
  const page = parts[0];
  if (page === "coleccion") $app.innerHTML = backBar("#/", "Volver al Inicio") + collectionPage();
  else if (page === "producto") {
    const p = PRODUCTS.find(x => x.slug === parts[1]);
    if (p) showProduct(p, "sm", 1); else $app.innerHTML = backBar("#/", "Volver al Inicio") + collectionPage();
  }
  else {
    // inicio (también cuando se pide #/historia, que baja a esa sección)
    $app.innerHTML = hero() + features() + stampsBand() + collectionSec() + slidesSection() + cartasSec() + atelierSec() + stampsBand() + nocheBand();
    startCarousel();
    const v = document.querySelector(".hero-vid");
    if (v && reduceMotion) { v.removeAttribute("autoplay"); v.pause(); }
  }
  if (page === "historia") {
    const el = document.getElementById("historia");
    if (el) { el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; }
  }
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", () => { closeCart(); route(); });
renderCart();
route();
