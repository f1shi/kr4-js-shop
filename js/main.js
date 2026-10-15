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

console.log(formatPrice(product.price));
console.log(calculateDiscount(product.price, product.discountPercent));
console.log(calculateFinalPrice(product.price, product.discountPercent));
