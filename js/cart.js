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

updateCartCounters();
