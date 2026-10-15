console.log('Файл main.js подключён');
console.table(product);

function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} руб.`;
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

function getProductStatus(product) {
  if (product.isAvailable) {
    return 'В наличии';
  }

  return 'Нет в наличии';
}

function createProductSummary(product) {
  const finalPrice = calculateFinalPrice(product.price, product.discountPercent);
  const status = getProductStatus(product);
  const discountText = product.discountPercent > 0 ? `, скидка ${product.discountPercent}%` : '';

  return `${product.title}: ${formatPrice(finalPrice)}${discountText}. Статус: ${status}.`;
}

console.log(formatPrice(product.price));
console.log(calculateDiscount(product.price, product.discountPercent));
console.log(calculateFinalPrice(product.price, product.discountPercent));
console.log(getProductStatus(product));

const productSummary = createProductSummary(product);

console.log(productSummary);

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement) {
  messageElement.textContent = 'JavaScript подключён корректно.';
}

if (productOutputElement) {
  productOutputElement.textContent = productSummary;
}
