/* scripts.js
   Handles:
   - dynamic prices per size
   - updating displayed price
   - building and opening WhatsApp order links (URL encoded)
   - quick contact order from contact page
*/

/* ========== CONFIGURATION ========== */
/* Replace this with your real WhatsApp number (international format). */
const WHATSAPP_NUMBER = "+919618108744"; // <-- change this to your real number

/* Product prices placeholder.
   You can change these numbers to actual prices (currency is implied).
   Structure: productId: { sizeValue: price }
*/
const PRODUCTS = {
  milk: {
    "0.5": 40,  // price for 0.5 litre
    "1": 75,
    "5": 350
  },
  ghee: {
    "0.5": 450, // 0.5 litre
    "1": 850
  },
  paneer: {
    "250": 90,
    "500": 170,
    "1000": 320
  },
  kova: {
    "250": 120,
    "500": 220,
    "1000": 420
  },
  curd: {
    "250": 40,
    "500": 75,
    "1000": 140
  },
  vermicompost: {
    "1": 80,
    "5": 350,
    "10": 650
  },
  cultural_vermi: {
    "1": 95,
    "5": 420,
    "10": 780
  },
};

/* Helper: format price (simple) */
function formatPrice(val) {
  if (typeof val !== "number") return "—";
  return "₹ " + val.toFixed(0);
}

/* Update all product price displays based on selected sizes */
function updateAllPrices() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    const size = card.querySelector('.size-select').value;
    const qty = parseInt(card.querySelector('.qty-input').value || "1", 10);
    const priceSpan = card.querySelector('.price-val');
    const base = PRODUCTS[id] && PRODUCTS[id][size];
    if (base === undefined) {
      priceSpan.innerText = "—";
    } else {
      priceSpan.innerText = formatPrice(base * qty);
    }
  });
}

/* Build WhatsApp message and open chat */
function orderOnWhatsApp(productId, productName, size, qty) {
  const basePrice = PRODUCTS[productId] && PRODUCTS[productId][size];
  const priceText = basePrice ? `Price (per unit): ₹${basePrice}` : '';
  const msg = `Hello, I want to order: ${productName} — Size: ${size} (Qty: ${qty}). ${priceText} Name: _____. Address: _____. Please confirm price and delivery.`;
  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g,'')}?text=${encoded}`;
  // open in new tab
  window.open(waUrl, '_blank');
}

/* Attach event handlers to product cards */
function initProductCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    const productName = card.querySelector('h3').innerText;
    const sizeSelect = card.querySelector('.size-select');
    const qtyInput = card.querySelector('.qty-input');
    const orderBtn = card.querySelector('.order-btn');

    // initial price
    updateAllPrices();

    // on size/qty change update price
    sizeSelect.addEventListener('change', updateAllPrices);
    qtyInput.addEventListener('input', updateAllPrices);

    // order button
    orderBtn.addEventListener('click', () => {
      const size = sizeSelect.value;
      const qty = parseInt(qtyInput.value || "1", 10);
      orderOnWhatsApp(id, productName, sizeToLabel(id, size), qty);
    });
  });
}

/* Convert size value to readable label for message */
function sizeToLabel(productId, sizeVal) {
  // for milk and ghee/others we handle based on productId
  if (productId === 'milk') {
    if (sizeVal === "0.5") return "½ litre";
    if (sizeVal === "1") return "1 litre";
    if (sizeVal === "5") return "5 litre";
  }
  if (productId === 'ghee') {
    if (sizeVal === "0.5") return "½ litre";
    if (sizeVal === "1") return "1 litre";
  }
  // weights
  if (sizeVal === "250") return "250 g";
  if (sizeVal === "500") return "500 g";
  if (sizeVal === "1000") return "1 kg";
  if (sizeVal === "1") return "1 kg";
  if (sizeVal === "5") return "5 kg";
  if (sizeVal === "10") return "10 kg";
  return sizeVal;
}

/* Quick order from contact page */
function initQuickOrder() {
  const btn = document.getElementById('sendQuickOrder');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name = document.getElementById('custName').value || "_____";
    const prod = document.getElementById('custProduct').value || "_____";
    const qty = document.getElementById('custQty').value || "1";
    const addr = document.getElementById('custAddress').value || "_____";
    const msg = `Hello, I want to order: ${prod} (Qty: ${qty}). Name: ${name}. Address: ${addr}. Please confirm price and delivery.`;
    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g,'')}?text=${encoded}`;
    window.open(waUrl, '_blank');
  });
}

/* Link to WhatsApp on contact page */
function updateWhatsAppLink() {
  const waLink = document.getElementById('wa-link');
  if (!waLink) return;
  waLink.href = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g,'')}`;
  waLink.innerText = WHATSAPP_NUMBER;
}

/* Set current year helpers for footer */
function setYears() {
  const y = new Date().getFullYear();
  ['year','year2','year3','year4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = y;
  });
}

/* Initialize everything on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  initProductCards();
  initQuickOrder();
  updateWhatsAppLink();
  setYears();

  // update prices when the page loads / if any input changed
  document.addEventListener('input', updateAllPrices);
  document.addEventListener('change', updateAllPrices);
});
