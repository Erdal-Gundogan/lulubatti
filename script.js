let cart = {};

if (localStorage.getItem('lulubattiCart')) {
    cart = JSON.parse(localStorage.getItem('lulubattiCart'));
}

let productStock = {};

if (localStorage.getItem('lulubattiStock')) {
    productStock = JSON.parse(localStorage.getItem('lulubattiStock'));
}

const cartCountDisplay = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const productCards = document.querySelectorAll('.product-card');

window.addEventListener("load", () => {
    productCards.forEach(card => {
        const name = card.dataset.name;
        const button = card.querySelector('.add-to-cart');
        const stockText = card.querySelector('.stock-count');

        if (productStock[name] !== undefined) {
            card.dataset.stock = productStock[name];
            stockText.textContent = productStock[name];

            if (productStock[name] === 0) {
                button.disabled = true;
                button.textContent = "Tükendi";
            }
        }
    });

    updateCartCount();
    updateCartPopup();
    
})

productCards.forEach(card => {
  const button = card.querySelector('.add-to-cart');
  const stockText = card.querySelector('.stock-count');

  button.addEventListener('click', () => {
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    let stock = parseInt(card.dataset.stock);

    if (stock > 0) {
      // Sepete ekle
      cart[name] = cart[name] ? cart[name] + 1 : 1;
      card.dataset.stock = stock - 1;
      stockText.textContent = stock - 1;

      productStock[name] = stock - 1;
      localStorage.setItem('lulubattiStock', JSON.stringify(productStock));

      // Sepet sayacını güncelle
      updateCartCount();

      // Stok 0 olduysa
      if (stock - 1 === 0) {
        button.disabled = true;
        button.textContent = "Tükendi";
      }
    }

    updateCartPopup();
  });
});

function updateCartCount() {
  let total = Object.values(cart).reduce((acc, val) => acc + val, 0);
  cartCountDisplay.textContent = total;
}

function updateCartPopup() {
  cartItemsList.innerHTML = '';
  let total = 0;

  for (let [name, qty] of Object.entries(cart)) {
    const card = [...productCards].find(c => c.dataset.name === name);
    const price = parseInt(card.dataset.price);
    const itemTotal = price * qty;
    total += itemTotal;

    const li = document.createElement('li');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${name} x ${qty} = ${itemTotal}€`;

    const removeButton = document.createElement('button');
    removeButton.textContent = '❌';
    removeButton.onclick = () => removeFromCart(name);

    li.appendChild(nameSpan);
    li.appendChild(removeButton);
    cartItemsList.appendChild(li);
  }

  const totalDisplay = document.getElementById('cart-total');
  totalDisplay.textContent = `Toplam: ${total}€`;

  localStorage.setItem('lulubattiCart', JSON.stringify(cart));
}

function removeFromCart(name) {
  if (cart[name]) {
    cart[name]--;

    // Ürünün kartını bul
    const card = [...productCards].find(c => c.dataset.name === name);
    const button = card.querySelector('.add-to-cart');
    const stockText = card.querySelector('.stock-count');
    let stock = parseInt(card.dataset.stock);

    // Stok 0'dan 1'e çıkarsa butonu tekrar aktif et
    if (parseInt(card.dataset.stock) === 0) {
      button.disabled = false;
      button.textContent = "Sepete Ekle";
    }

    card.dataset.stock = stock + 1;
    stockText.textContent = stock + 1;

    productStock[name] = stock + 1;
    localStorage.setItem('lulubattiStock', JSON.stringify(productStock));

    if (cart[name] === 0) {
      delete cart[name];
    }

    updateCartCount();
    updateCartPopup();
  }
}

function openCart() {
  document.getElementById('cart-popup').classList.remove('hidden');
}

function closeCart() {
  document.getElementById('cart-popup').classList.add('hidden');
}

function completeOrder() {
    if (Object.keys(cart).length === 0) {
        alert("Sepetiniz boş!");
        return;
    }

    alert("Siparişiniz başarıyla alındı! Teşekkür ederiz.");

    cart = {};
    updateCartCount();
    updateCartPopup();
}
