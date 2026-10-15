const productParams = new URLSearchParams(window.location.search);
const productIdFromUrl = Number(productParams.get('id')) || 1;
const pageProduct = findProductById(products, productIdFromUrl);

const productTitleElement = document.querySelector('[data-product-title]');
const productBreadcrumb = document.querySelector('[data-product-breadcrumb]');
const productImage = document.querySelector('[data-product-image]');
const productSource = document.querySelector('[data-product-source]');
const productPrice = document.querySelector('[data-product-price]');
const productStatus = document.querySelector('[data-product-status]');
const productDescription = document.querySelector('[data-product-description]');
const productCaption = document.querySelector('[data-product-caption]');
const productSpecs = document.querySelector('[data-product-specs]');
const productMessage = document.querySelector('[data-product-message]');
const productCartButton = document.querySelector('.product-detail [data-action="add-to-cart"]');
const productOrderButton = document.querySelector('.product-detail [data-product]');
const productReviews = document.querySelector('[data-reviews]');
const productReviewsEmpty = document.querySelector('[data-reviews-empty]');

function createSpecRow(name, value) {
  const row = document.createElement('tr');
  const header = document.createElement('th');
  const cell = document.createElement('td');

  header.scope = 'row';
  header.textContent = name;
  cell.textContent = value;

  row.append(header, cell);
  return row;
}

function renderProductPage(product) {
  const finalPrice = calculateFinalPrice(product.price, product.discountPercent);

  document.title = `ShopProject — ${product.title}`;
  productTitleElement.textContent = product.title;
  productBreadcrumb.textContent = product.title;
  productDescription.textContent = product.description;
  productStatus.textContent = getProductStatus(product);
  productStatus.classList.toggle('product-detail__status--unavailable', !product.isAvailable);

  productPrice.textContent = formatPrice(finalPrice);

  if (product.discountPercent > 0) {
    const oldPrice = document.createElement('s');
    oldPrice.classList.add('product-card__old-price');
    oldPrice.textContent = formatPrice(product.price);
    productPrice.append(' ', oldPrice);
  }

  productImage.src = product.image;
  productImage.alt = product.title;

  if (productSource) {
    productSource.srcset = product.image.replace('.jpg', '.webp');
  }

  productCaption.textContent = `Основные характеристики: ${product.title}`;
  productSpecs.textContent = '';
  productSpecs.append(
    createSpecRow('Категория', categoryLabels[product.category] || product.category),
    createSpecRow('Описание', product.description),
    createSpecRow('Цена без скидки', formatPrice(product.price)),
    createSpecRow('Скидка', product.discountPercent > 0 ? `${product.discountPercent}%` : 'нет'),
    createSpecRow('Рейтинг', `${product.rating.toFixed(1)} из 5`),
    createSpecRow('Наличие', getProductStatus(product))
  );

  productCartButton.dataset.productId = String(product.id);
  productCartButton.disabled = !product.isAvailable;
  productCartButton.textContent = product.isAvailable ? 'В корзину' : 'Нет в наличии';
  productOrderButton.dataset.product = product.title;

  if (productReviews && productReviewsEmpty) {
    const hasReviews = product.id === 1;
    productReviews.hidden = !hasReviews;
    productReviewsEmpty.hidden = hasReviews;
  }
}

if (pageProduct && productTitleElement && productParams.has('id')) {
  renderProductPage(pageProduct);
}

if (productCartButton) {
  productCartButton.addEventListener('click', () => {
    const isAdded = addToCart(Number(productCartButton.dataset.productId));

    if (productMessage && isAdded) {
      productMessage.textContent = 'Товар добавлен в корзину.';
    }
  });
}
