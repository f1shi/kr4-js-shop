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

function getProductTitles(products) {
  return products.map((product) => product.title);
}

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return products;
  }

  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }

  return products.filter((product) => {
    return product.category === category;
  });
}

function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];

  if (direction === 'desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }

  return productsCopy.sort((a, b) => a.price - b.price);
}

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

function calculateTotalPrice(products) {
  return products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);
}

function countAvailableProducts(products) {
  return products.filter((product) => product.isAvailable).length;
}

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}

function getPreparedProducts(products, query, category, sortDirection) {
  let result = [...products];

  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);

  return result;
}

const firstProduct = products[0];

console.log(formatPrice(firstProduct.price));
console.log(calculateDiscount(firstProduct.price, firstProduct.discountPercent));
console.log(calculateFinalPrice(firstProduct.price, firstProduct.discountPercent));
console.log(getProductStatus(firstProduct));

const productSummary = createProductSummary(firstProduct);

console.log(productSummary);

console.log(getProductTitles(products));
console.table(getAvailableProducts(products));
console.table(searchProducts(products, 'наушники'));

console.table(filterProductsByCategory(products, 'laptops'));
console.table(sortProductsByPrice(products, 'asc'));
console.table(sortProductsByPrice(products, 'desc'));

const selectedProduct = findProductById(products, 3);

if (selectedProduct) {
  console.log(`Найден товар: ${selectedProduct.title}`);
} else {
  console.log('Товар не найден');
}

console.log(calculateTotalPrice(products));
console.log(countAvailableProducts(products));
console.log(calculateAveragePrice(products));

console.table(getPreparedProducts(products, 'о', 'laptops', 'asc'));

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement) {
  messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
}

if (productOutputElement) {
  productOutputElement.textContent = [
    `Всего товаров: ${products.length}`,
    `Товаров в наличии: ${countAvailableProducts(products)}`,
    `Средняя цена: ${formatPrice(calculateAveragePrice(products))}`,
    `Результатов поиска "наушники": ${searchProducts(products, 'наушники').length}`,
    `Пример карточки: ${productSummary}`
  ].join('\n');
}
