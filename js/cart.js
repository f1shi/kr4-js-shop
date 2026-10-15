const CART_STORAGE_KEY = 'shop-cart';

let cartItems = loadFromStorage(CART_STORAGE_KEY, []);

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

const cartList = document.querySelector('[data-cart-list]');
const cartEmpty = document.querySelector('.cart-empty');

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

updateCartCounters();
renderCart();
