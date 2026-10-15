const CART_STORAGE_KEY = 'shop-cart';
const PROMO_STORAGE_KEY = 'shop-promo';
const PROMO_CODES = {
  STUDENT10: 10,
  SHOP5: 5
};

let cartItems = loadFromStorage(CART_STORAGE_KEY, []);
let appliedPromoCode = loadFromStorage(PROMO_STORAGE_KEY, '');

function saveCart() {
  saveToStorage(CART_STORAGE_KEY, cartItems);
}

function getCartCount() {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCounters() {
  const counters = document.querySelectorAll('[data-cart-count]');
  const count = getCartCount();

  counters.forEach((counter) => {
    counter.textContent = String(count);
    counter.classList.toggle('cart-counter--empty', count === 0);
  });
}

function addToCart(productId) {
  const product = findProductById(products, productId);

  if (!product || !product.isAvailable) {
    return false;
  }

  const existingItem = cartItems.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ id: productId, quantity: 1 });
  }

  saveCart();
  updateCartCounters();
  return true;
}

function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  saveCart();
  updateCartCounters();
}

function changeCartQuantity(productId, delta) {
  const item = cartItems.find((cartItem) => cartItem.id === productId);

  if (!item) {
    return;
  }

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartCounters();
}

function clearCart() {
  cartItems = [];
  saveCart();
  updateCartCounters();
}

function getCartProducts() {
  return cartItems
    .map((item) => {
      const product = findProductById(products, item.id);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

function calculateCartSubtotal(cartProducts) {
  return cartProducts.reduce((sum, cartProduct) => {
    const unitPrice = calculateFinalPrice(cartProduct.product.price, cartProduct.product.discountPercent);
    return sum + unitPrice * cartProduct.quantity;
  }, 0);
}

function getPromoPercent(code) {
  return PROMO_CODES[code] || 0;
}

function calculatePromoDiscount(subtotal, code) {
  return Math.round(subtotal * getPromoPercent(code) / 100);
}

const cartList = document.querySelector('[data-cart-list]');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotalCount = document.querySelector('[data-cart-total-count]');
const cartSubtotal = document.querySelector('[data-cart-subtotal]');
const cartPromo = document.querySelector('[data-cart-promo]');
const cartTotal = document.querySelector('[data-cart-total]');
const cartCheckout = document.querySelector('[data-cart-checkout]');
const clearCartButton = document.querySelector('[data-action="clear-cart"]');
const promoForm = document.querySelector('.promo-form');
const promoInput = document.querySelector('#promo-code');
const promoMessage = document.querySelector('.promo-form__message');

function createCartButton(text, action, productId, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('cart-item__button');
  button.textContent = text;
  button.dataset.action = action;
  button.dataset.productId = String(productId);
  button.setAttribute('aria-label', label);
  return button;
}

function createCartItem(cartProduct) {
  const { product, quantity } = cartProduct;
  const unitPrice = calculateFinalPrice(product.price, product.discountPercent);

  const item = document.createElement('li');
  item.classList.add('cart-item');

  const image = document.createElement('img');
  image.classList.add('cart-item__image');
  image.src = product.image;
  image.alt = '';
  image.width = 120;
  image.height = 90;

  const info = document.createElement('div');
  info.classList.add('cart-item__info');

  const title = document.createElement('h3');
  title.classList.add('cart-item__title');
  title.textContent = product.title;

  const price = document.createElement('p');
  price.classList.add('cart-item__price');
  price.textContent = `${formatPrice(unitPrice)} за шт.`;

  info.append(title, price);

  const quantityBox = document.createElement('div');
  quantityBox.classList.add('cart-item__quantity');

  const quantityValue = document.createElement('span');
  quantityValue.classList.add('cart-item__quantity-value');
  quantityValue.textContent = String(quantity);

  quantityBox.append(
    createCartButton('−', 'decrease', product.id, `Уменьшить количество: ${product.title}`),
    quantityValue,
    createCartButton('+', 'increase', product.id, `Увеличить количество: ${product.title}`)
  );

  const lineTotal = document.createElement('p');
  lineTotal.classList.add('cart-item__total');
  lineTotal.textContent = formatPrice(unitPrice * quantity);

  const removeButton = createCartButton('Удалить', 'remove', product.id, `Удалить из корзины: ${product.title}`);
  removeButton.classList.add('cart-item__remove');

  item.append(image, info, quantityBox, lineTotal, removeButton);

  return item;
}

function renderCart() {
  if (!cartList) {
    return;
  }

  const cartProducts = getCartProducts();

  cartList.textContent = '';

  if (cartEmpty) {
    cartEmpty.hidden = cartProducts.length > 0;
  }

  cartProducts.forEach((cartProduct) => {
    cartList.append(createCartItem(cartProduct));
  });

  renderCartSummary(cartProducts);
}

function renderCartSummary(cartProducts) {
  const subtotal = calculateCartSubtotal(cartProducts);
  const promoDiscount = calculatePromoDiscount(subtotal, appliedPromoCode);
  const isEmpty = cartProducts.length === 0;

  if (cartTotalCount) {
    cartTotalCount.textContent = String(getCartCount());
  }

  if (cartSubtotal) {
    cartSubtotal.textContent = formatPrice(subtotal);
  }

  if (cartPromo) {
    cartPromo.textContent = promoDiscount > 0
      ? `−${formatPrice(promoDiscount)} (${appliedPromoCode})`
      : formatPrice(0);
  }

  if (cartTotal) {
    cartTotal.textContent = formatPrice(subtotal - promoDiscount);
  }

  if (cartCheckout) {
    cartCheckout.classList.toggle('button--disabled', isEmpty);
    cartCheckout.setAttribute('aria-disabled', String(isEmpty));
  }

  if (clearCartButton) {
    clearCartButton.disabled = isEmpty;
  }
}

if (cartList) {
  cartList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);

    if (button.dataset.action === 'increase') {
      changeCartQuantity(productId, 1);
    }

    if (button.dataset.action === 'decrease') {
      changeCartQuantity(productId, -1);
    }

    if (button.dataset.action === 'remove') {
      removeFromCart(productId);
    }

    renderCart();
  });
}

if (clearCartButton) {
  clearCartButton.addEventListener('click', () => {
    clearCart();
    renderCart();
  });
}

if (cartCheckout) {
  cartCheckout.addEventListener('click', (event) => {
    if (cartItems.length === 0) {
      event.preventDefault();
    }
  });
}

if (promoForm && promoInput && promoMessage) {
  if (appliedPromoCode) {
    promoInput.value = appliedPromoCode;
  }

  promoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const code = promoInput.value.trim().toUpperCase();

    if (code === '') {
      appliedPromoCode = '';
      saveToStorage(PROMO_STORAGE_KEY, appliedPromoCode);
      promoMessage.textContent = 'Промокод удалён.';
      renderCart();
      return;
    }

    if (getPromoPercent(code) === 0) {
      promoMessage.textContent = 'Такого промокода нет.';
      return;
    }

    appliedPromoCode = code;
    saveToStorage(PROMO_STORAGE_KEY, appliedPromoCode);
    promoMessage.textContent = `Промокод ${code} применён: скидка ${getPromoPercent(code)}%.`;
    renderCart();
  });
}

updateCartCounters();
renderCart();
