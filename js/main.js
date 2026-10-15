console.log('Файл main.js подключён');
console.log(products);
console.table(products);

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

const firstProduct = products[0];

console.log(formatPrice(firstProduct.price));
console.log(calculateDiscount(firstProduct.price, firstProduct.discountPercent));
console.log(calculateFinalPrice(firstProduct.price, firstProduct.discountPercent));
console.log(getProductStatus(firstProduct));

const productSummary = createProductSummary(firstProduct);

console.log(productSummary);

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement) {
  messageElement.textContent = 'JavaScript подключён корректно.';
}

if (productOutputElement) {
  productOutputElement.textContent = productSummary;
}
