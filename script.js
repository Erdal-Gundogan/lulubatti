if (performance.getEntriesByType("navigation")[0].type !== "reload") {
    localStorage.removeItem('lulubattiCart');
    localStorage.removeItem('lulubattiStock');
}


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
                button.textContent = translations[language].soldOut;
            }
        }
    });

    updateCartCount();
    updateCartPopup();
    applyLanguage();
});

productCards.forEach(card => {
    const button = card.querySelector('.add-to-cart');
    const stockText = card.querySelector('.stock-count');

    button.addEventListener('click', () => {
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        let stock = parseInt(card.dataset.stock);

        if (stock > 0) {
            cart[name] = cart[name] ? cart[name] + 1 : 1;
            card.dataset.stock = stock - 1;
            stockText.textContent = stock - 1;

            productStock[name] = stock - 1;
            localStorage.setItem('lulubattiStock', JSON.stringify(productStock));

            updateCartCount();

            if (stock - 1 === 0) {
                button.disabled = true;
                button.textContent = translations[language].soldOut;
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
    totalDisplay.textContent = `${translations[language].totalLabel}: ${total}€`;

    localStorage.setItem('lulubattiCart', JSON.stringify(cart));
}

function removeFromCart(name) {
    if (cart[name]) {
        cart[name]--;

        const card = [...productCards].find(c => c.dataset.name === name);
        const button = card.querySelector('.add-to-cart');
        const stockText = card.querySelector('.stock-count');
        let stock = parseInt(card.dataset.stock);

        if (parseInt(card.dataset.stock) === 0) {
            button.disabled = false;
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
        alert(translations[language].cartEmpty);
        return;
    }

    alert(translations[language].orderComplete);

    cart = {};
    updateCartCount();
    updateCartPopup();
}

let language = 'tr';

function toggleLanguage() {
    language = language === 'tr' ? 'en' : 'tr';
    applyLanguage();
}

const translations = {
    tr: {
        gallery: "Kedi Battaniyeleri",
        about: "Hakkımızda",
        aboutText: "Merhaba! Ben Lulubatti'nin kurucusuyum. El emeğiyle ördüğüm kedi battaniyeleri, minik dostlarımız için sıcacık bir konfor sunuyor.",
        contact: "İletişim",
        nameLabel: "Adınız:",
        emailLabel: "E-posta:",
        messageLabel: "Mesajınız:",
        sendButton: "Gönder",
        cartText: "🧺 Sepet: ",
        orderButton: "🧾 Siparişi Tamamla",
        closeButton: "Kapat",
        cartEmpty: "Sepetiniz boş!",
        orderComplete: "Siparişiniz başarıyla alındı! Teşekkür ederiz.",
        languageButton: "🌐 Dili Değiştir (TR/EN)",
        addToCart: "Sepete Ekle",
        soldOut: "Tükendi",
        totalLabel: "Toplam",
        products: [
            {
                name: "Renkli Çizgili Battaniye",
                enName: "Colorful Striped Blanket",
                trDesc: "Yerinde duramayan kedilere neşeli renkler.",
                enDesc: "Cheerful colors for active cats."
            },
            {
                name: "Pamuk Battaniye",
                enName: "Cotton Blanket",
                trDesc: "100% pamuklu battaniye.",
                enDesc: "100% cotton blanket."
            },
            {
                name: "Sevimli Battaniye",
                enName: "Cute Blanket",
                trDesc: "Çok sevimli battaniye.",
                enDesc: "Very cute blanket."
            }
        ]
    },
    en: {
        gallery: "Cat Blankets",
        about: "About Us",
        aboutText: "Hi! I'm the founder of Lulubatti. I lovingly hand-knit cozy blankets to bring warmth to your feline friends.",
        contact: "Contact",
        nameLabel: "Your Name:",
        emailLabel: "Email:",
        messageLabel: "Message:",
        sendButton: "Send",
        cartText: "🧺 Cart: ",
        orderButton: "🧾 Complete Order",
        closeButton: "Close",
        cartEmpty: "Your cart is empty!",
        orderComplete: "Your order has been placed! Thank you.",
        languageButton: "🌐 Change Language (TR/EN)",
        addToCart: "Add to Cart",
        soldOut: "Sold Out",
        totalLabel: "Total",
        products: [
            {
                name: "Renkli Çizgili Battaniye",
                enName: "Colorful Striped Blanket",
                trDesc: "Yerinde duramayan kedilere neşeli renkler.",
                enDesc: "Cheerful colors for active cats."
            },
            {
                name: "Pamuk Battaniye",
                enName: "Cotton Blanket",
                trDesc: "100% pamuklu battaniye.",
                enDesc: "100% cotton blanket."
            },
            {
                name: "Sevimli Battaniye",
                enName: "Cute Blanket",
                trDesc: "Çok sevimli battaniye.",
                enDesc: "Very cute blanket."
            }
        ]
    }
};

function applyLanguage() {
    const t = translations[language];

    document.querySelector('#galeri h2').textContent = t.gallery;
    document.querySelector('#hakkimizda h2').textContent = t.about;
    document.querySelector('#hakkimizda p').textContent = t.aboutText;
    document.querySelector('#iletisim h2').textContent = t.contact;

    document.querySelector('label[for="name"]').textContent = t.nameLabel;
    document.querySelector('label[for="email"]').textContent = t.emailLabel;
    document.querySelector('label[for="message"]').textContent = t.messageLabel;
    document.querySelector('.contact-form button[type="submit"]').textContent = t.sendButton;

    document.querySelector('.cart-status').childNodes[0].textContent = t.cartText;

    document.querySelector('#cart-popup button[onclick="completeOrder()"]').textContent = t.orderButton;
    document.querySelector('#cart-popup button[onclick="closeCart()"]').textContent = t.closeButton;

    document.getElementById('language-toggle').textContent = t.languageButton;

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        const prod = t.products[index];
        card.querySelector('h3').textContent = prod.enName;
        card.querySelector('.desc').textContent = prod.enDesc;

        const button = card.querySelector('.add-to-cart');
        if (parseInt(card.dataset.stock) === 0) {
            button.textContent = t.soldOut;
        } else {
            button.textContent = t.addToCart;
        }
    });
}
