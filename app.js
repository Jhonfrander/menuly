/**
 * Brasa & Barrio — demo de menú digital con pedido por WhatsApp.
 *
 * Para personalizarlo:
 * 1. Cambia CONFIG.whatsapp por el número real (sin +, sin espacios).
 * 2. Reemplaza PRODUCTS por el menú del restaurante.
 * 3. Ajusta los textos del HTML.
 *
 * Este demo no tiene backend: el pedido se genera en el navegador
 * y se envía por un enlace wa.me. En Laravel, el pedido se guarda
 * primero y el mensaje se construye desde el servidor.
 */

const CONFIG = {
  restaurantName: "Brasa & Barrio",
  whatsapp: "584120000000", // ← cámbialo antes de mostrarlo
  currency: "$",
  // En true, el botón muestra una vista previa del pedido en vez de abrir
  // WhatsApp. Déjalo en true mientras sea una demo pública.
  demoMode: true,
};

const CATEGORIES = [
  { id: "all", name: "Todo" },
  { id: "entradas", name: "Entradas" },
  { id: "principales", name: "Principales" },
  { id: "postres", name: "Postres" },
  { id: "bebidas", name: "Bebidas" },
];

// Las fotos viven en demo/assets/img para que el demo sea autocontenido.
const image = (file) => `assets/img/${file}`;

const PRODUCTS = [
  {
    id: "tabla",
    category: "entradas",
    name: "Tabla de quesos y embutidos",
    description: "Selección de quesos, jamón serrano, aceitunas y pan de la casa.",
    price: 14,
    image: image("tabla.jpg"),
    tag: "Para compartir",
    available: true,
  },
  {
    id: "alitas",
    category: "entradas",
    name: "Alitas glaseadas",
    description: "BBQ de la casa, semillas de ajonjolí y limón.",
    price: 8.5,
    image: image("alitas.jpg"),
    available: true,
  },
  {
    id: "papas",
    category: "entradas",
    name: "Papas rústicas",
    description: "Con romero, sal gruesa y alioli de ajo.",
    price: 5,
    image: image("papas.jpg"),
    available: true,
  },
  {
    id: "hamburguesa",
    category: "principales",
    name: "Hamburguesa Brasa",
    description: "Doble carne, queso ahumado, cebolla caramelizada y pan brioche.",
    price: 12,
    image: image("hamburguesa.jpg"),
    tag: "Más pedido",
    available: true,
  },
  {
    id: "costillas",
    category: "principales",
    name: "Costillas BBQ",
    description: "Costilla de cerdo cocida 12 horas, puré rústico y ensalada.",
    price: 16,
    image: image("costillas.jpg"),
    tag: "Para compartir",
    available: true,
  },
  {
    id: "punta",
    category: "principales",
    name: "Punta trasera",
    description: "300 g a la parrilla, papas rústicas y chimichurri fresco.",
    price: 18,
    image: image("punta.jpg"),
    available: true,
  },
  {
    id: "pollo",
    category: "principales",
    name: "Pollo a la brasa",
    description: "Medio pollo marinado, papas y ensalada de la casa.",
    price: 13,
    image: image("pollo.jpg"),
    available: true,
  },
  {
    id: "bowl",
    category: "principales",
    name: "Bowl vegetariano",
    description: "Quinoa, aguacate, vegetales asados y aderezo de tahini.",
    price: 10,
    image: image("bowl.jpg"),
    tag: "Vegetariano",
    available: true,
  },
  {
    id: "brownie",
    category: "postres",
    name: "Brownie con helado",
    description: "Chocolate 70%, helado de vainilla y salsa de caramelo.",
    price: 6.5,
    image: image("brownie.jpg"),
    available: true,
  },
  {
    id: "torta",
    category: "postres",
    name: "Torta de chocolate",
    description: "Bizcocho de cacao, ganache y crema de chocolate.",
    price: 5.5,
    image: image("torta.jpg"),
    available: false,
  },
  {
    id: "cheesecake",
    category: "postres",
    name: "Cheesecake de frutos rojos",
    description: "Base de galleta, queso crema y coulis de frutos rojos.",
    price: 6,
    image: image("cheesecake.jpg"),
    available: true,
  },
  {
    id: "coctel",
    category: "bebidas",
    name: "Cóctel de la casa",
    description: "Martini de frutos rojos, cítricos y hielo.",
    price: 6,
    image: image("coctel.jpg"),
    tag: "Refrescante",
    available: true,
  },
  {
    id: "cerveza",
    category: "bebidas",
    name: "Cerveza artesanal",
    description: "IPA local de 330 ml, notas cítricas.",
    price: 5,
    image: image("cerveza.jpg"),
    available: true,
  },
  {
    id: "cafe",
    category: "bebidas",
    name: "Café de la casa",
    description: "Espresso o americano, grano de la sierra.",
    price: 2.5,
    image: image("cafe.jpg"),
    available: true,
  },
];

const CART_KEY = "brasa-barrio-cart-v1";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const cartToggle = $("#cart-toggle");
const cartCount = $("#cart-count");
const cartDrawer = $("#cart-drawer");
const cartClose = $("#cart-close");
const cartItems = $("#cart-items");
const cartTotal = $("#cart-total");
const overlay = $("#overlay");
const tabs = $("#category-tabs");
const menuGrid = $("#menu-grid");
const orderForm = $("#order-form");
const sendButton = $("#send-order");
const deliverySelect = $("#delivery-type");
const addressField = $("#address-field");
const addressInput = $("#customer-address");
const heroOrder = $("#hero-order");
const toast = $("#toast");
const cartHint = $("#cart-hint");
const modalOverlay = $("#modal-overlay");
const orderModal = $("#order-modal");
const orderModalClose = $("#order-modal-close");
const orderPreview = $("#order-preview");
const copyOrder = $("#copy-order");
const closeOrder = $("#close-order");

let activeCategory = "all";
let cart = loadCart();
let toastTimer;
let lastOrderMessage = "";

const plusIcon = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>`;

/* ---------- Utilidades ---------- */

function formatMoney(value) {
  return `${CONFIG.currency}${Number(value).toFixed(2)}`;
}

function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        Number.isInteger(item.qty) &&
        item.qty > 0 &&
        findProduct(item.id)
    );
  } catch {
    return [];
  }
}

function persistCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* El carrito sigue en memoria aunque el navegador bloquee storage. */
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    showToast("Pedido copiado");
  } catch {
    showToast("No se pudo copiar. Selecciona el texto manualmente.");
  }

  textarea.remove();
}

/* ---------- Render del menú ---------- */

function renderTabs() {
  tabs.innerHTML = CATEGORIES.map(
    (category) => `
      <button
        class="tab ${category.id === activeCategory ? "active" : ""}"
        type="button"
        role="tab"
        aria-selected="${category.id === activeCategory}"
        data-category="${category.id}"
      >${category.name}</button>`
  ).join("");
}

function productCard(product) {
  const soldOut = product.available === false;

  return `
    <article class="menu-card ${soldOut ? "sold-out" : ""}">
      <div class="card-media">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          decoding="async"
        />
        ${product.tag ? `<span class="card-tag">${product.tag}</span>` : ""}
      </div>
      <div class="card-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="card-footer">
          <span class="price">${formatMoney(product.price)}</span>
          <button
            class="add-button"
            type="button"
            data-add="${product.id}"
            aria-label="${soldOut ? "Producto agotado" : `Agregar ${product.name}`}"
            ${soldOut ? "disabled" : ""}
          >${soldOut ? "—" : plusIcon}</button>
        </div>
      </div>
    </article>`;
}

function renderMenu() {
  const visible =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === activeCategory);

  menuGrid.innerHTML = visible.map(productCard).join("");
}

/* ---------- Carrito ---------- */

function detailedCart() {
  return cart
    .map((item) => ({ ...item, product: findProduct(item.id) }))
    .filter((item) => item.product);
}

function renderCart() {
  const items = detailedCart();

  if (!items.length) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <strong>Tu carrito está vacío</strong>
        <p>Agrega algo del menú y vuelve aquí.</p>
      </div>`;
  } else {
    cartItems.innerHTML = items
      .map(
        ({ product, qty }) => `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <h4>${product.name}</h4>
            <span class="item-price">${formatMoney(product.price)} c/u</span>
            <div class="qty-control">
              <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Quitar uno de ${product.name}">−</button>
              <span>${qty}</span>
              <button type="button" data-action="increase" data-id="${product.id}" aria-label="Agregar uno de ${product.name}">+</button>
            </div>
          </div>
          <div>
            <div class="cart-item-total">${formatMoney(product.price * qty)}</div>
            <button class="remove-item" type="button" data-action="remove" data-id="${product.id}">Quitar</button>
          </div>
        </div>`
      )
      .join("");
  }

  const count = items.reduce((total, item) => total + item.qty, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  cartCount.textContent = count;
  cartTotal.textContent = formatMoney(total);
  cartDrawer.classList.toggle("is-empty", items.length === 0);
  sendButton.disabled = items.length === 0;
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product || product.available === false) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  persistCart();
  renderCart();
  showToast(`${product.name} agregado`);
}

function changeQuantity(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }

  persistCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((entry) => entry.id !== id);
  persistCart();
  renderCart();
}

/* ---------- Drawer ---------- */

function syncBodyScroll() {
  const locked =
    cartDrawer.classList.contains("open") ||
    orderModal.classList.contains("open");
  document.body.classList.toggle("no-scroll", locked);
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartToggle.setAttribute("aria-expanded", "true");
  syncBodyScroll();
  cartClose.focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartToggle.setAttribute("aria-expanded", "false");
  syncBodyScroll();
  cartToggle.focus();
}

function openOrderModal(message) {
  lastOrderMessage = message;
  orderPreview.textContent = message;
  modalOverlay.classList.add("open");
  orderModal.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
  syncBodyScroll();
  orderModalClose.focus();
}

function closeOrderModal() {
  modalOverlay.classList.remove("open");
  orderModal.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
  syncBodyScroll();
}

/* ---------- Pedido por WhatsApp ---------- */

function buildOrderMessage() {
  const items = detailedCart();
  const data = new FormData(orderForm);
  const isDelivery = data.get("delivery") === "delivery";

  const lines = items.map(
    ({ product, qty }) =>
      `• ${qty}x ${product.name} — ${formatMoney(product.price * qty)}`
  );

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  let message =
    `Hola ${CONFIG.restaurantName}, quiero hacer este pedido:\n\n` +
    `${lines.join("\n")}\n\n` +
    `Total: ${formatMoney(total)}\n\n` +
    `Nombre: ${String(data.get("name") || "").trim()}\n` +
    `Teléfono: ${String(data.get("phone") || "").trim()}\n` +
    `Entrega: ${isDelivery ? "Delivery" : "Retiro en el local"}`;

  const address = String(data.get("address") || "").trim();
  if (isDelivery && address) {
    message += `\nDirección: ${address}`;
  }

  const notes = String(data.get("notes") || "").trim();
  if (notes) {
    message += `\nNotas: ${notes}`;
  }

  return message;
}

function sendOrder() {
  if (!detailedCart().length) {
    showToast("Tu carrito está vacío");
    return;
  }

  if (!orderForm.reportValidity()) return;

  const message = buildOrderMessage();

  if (CONFIG.demoMode) {
    openOrderModal(message);
    return;
  }

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
  showToast("Abriendo WhatsApp con tu pedido…");
}

/* ---------- Eventos ---------- */

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  renderTabs();
  renderMenu();
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === "increase") changeQuantity(id, 1);
  if (action === "decrease") changeQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
});

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

modalOverlay.addEventListener("click", closeOrderModal);
orderModalClose.addEventListener("click", closeOrderModal);
closeOrder.addEventListener("click", closeOrderModal);

copyOrder.addEventListener("click", async () => {
  if (!lastOrderMessage) return;

  try {
    await navigator.clipboard.writeText(lastOrderMessage);
    showToast("Pedido copiado");
  } catch {
    fallbackCopy(lastOrderMessage);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (orderModal.classList.contains("open")) {
    closeOrderModal();
    return;
  }

  if (cartDrawer.classList.contains("open")) {
    closeCart();
  }
});

deliverySelect.addEventListener("change", () => {
  const isDelivery = deliverySelect.value === "delivery";
  addressField.hidden = !isDelivery;
  addressInput.required = isDelivery;
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendOrder();
});

heroOrder.addEventListener("click", () => {
  if (cart.length) {
    openCart();
    return;
  }

  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  showToast("Elige tus platos para empezar");
});

/* ---------- Inicio ---------- */

if (!CONFIG.demoMode) {
  cartHint.textContent =
    "Se abrirá WhatsApp con el resumen. El pago se coordina al recibir.";
}

renderTabs();
renderMenu();
renderCart();
