const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');
const catalogMessage = document.querySelector('.catalog-message');
const favoritesOnlyCheckbox = document.querySelector('#favorites-only');
const favoritesCount = document.querySelector('[data-favorites-count]');

const FAVORITES_STORAGE_KEY = 'shop-favorites';
const PRODUCTS_PER_PAGE = 6;
const paginationContainer = document.querySelector('[data-pagination]');

let favoriteIds = loadFromStorage(FAVORITES_STORAGE_KEY, []);

if (!productsContainer) {
  console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
}

const catalogState = {
  query: '',
  category: 'all',
  sort: 'default',
  onlyFavorites: false,
  page: 1
};

function isFavorite(productId) {
  return favoriteIds.includes(productId);
}

function toggleFavorite(productId) {
  if (isFavorite(productId)) {
    favoriteIds = favoriteIds.filter((id) => id !== productId);
  } else {
    favoriteIds.push(productId);
  }

  saveToStorage(FAVORITES_STORAGE_KEY, favoriteIds);
}

function filterFavoriteProducts(products, onlyFavorites) {
  if (!onlyFavorites) {
    return products;
  }

  return products.filter((product) => isFavorite(product.id));
}

function updateFavoritesCount() {
  if (favoritesCount) {
    favoritesCount.textContent = `(${favoriteIds.length})`;
  }
}

function sortProducts(products, sortType) {
  const productsCopy = [...products];

  if (sortType === 'price-asc') {
    return productsCopy.sort((a, b) => a.price - b.price);
  }

  if (sortType === 'price-desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }

  if (sortType === 'title-asc') {
    return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
  }

  return productsCopy;
}

function getPreparedProducts(products, state) {
  let result = [...products];

  result = searchProducts(result, state.query);
  result = filterProductsByCategory(result, state.category);
  result = filterFavoriteProducts(result, state.onlyFavorites);
  result = sortProducts(result, state.sort);

  return result;
}

const categoryLabels = {
  smartphones: 'Смартфоны',
  laptops: 'Ноутбуки',
  headphones: 'Наушники',
  accessories: 'Аксессуары'
};

function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  if (product.discountPercent > 0) {
    card.classList.add('product-card--discount');

    const badge = document.createElement('span');
    badge.classList.add('product-card__badge', 'product-card__badge--discount');
    badge.textContent = `−${product.discountPercent}%`;
    card.append(badge);
  }

  if (!product.isAvailable) {
    card.classList.add('product-card--unavailable');
  }

  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image;
  image.alt = product.title;
  image.width = 640;
  image.height = 480;
  image.loading = 'lazy';

  const category = document.createElement('p');
  category.classList.add('product-card__category');
  category.textContent = categoryLabels[product.category] || product.category;

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = product.title;

  const rating = document.createElement('p');
  rating.classList.add('product-card__rating');
  rating.textContent = `Рейтинг: ${product.rating.toFixed(1)} из 5`;

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = product.description;

  const price = document.createElement('p');
  price.classList.add('product-card__price');
  price.textContent = formatPrice(calculateFinalPrice(product.price, product.discountPercent));

  if (product.discountPercent > 0) {
    const oldPrice = document.createElement('s');
    oldPrice.classList.add('product-card__old-price');
    oldPrice.textContent = formatPrice(product.price);
    price.append(' ', oldPrice);
  }

  const status = document.createElement('p');
  status.classList.add('product-card__status');
  status.textContent = getProductStatus(product);

  if (!product.isAvailable) {
    status.classList.add('product-card__status--unavailable');
  }

  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');

  const detailsLink = document.createElement('a');
  detailsLink.classList.add('button', 'button--outline');
  detailsLink.href = `product.html?id=${product.id}`;
  detailsLink.textContent = 'Подробнее';

  const button = document.createElement('button');
  button.classList.add('button', 'button--primary', 'product-card__button');
  button.type = 'button';
  button.textContent = 'В корзину';
  button.dataset.action = 'add-to-cart';
  button.dataset.productId = String(product.id);

  if (!product.isAvailable) {
    button.disabled = true;
    button.textContent = 'Недоступно';
  }

  const favoriteButton = document.createElement('button');
  favoriteButton.classList.add('product-card__favorite');
  favoriteButton.type = 'button';
  favoriteButton.dataset.action = 'toggle-favorite';
  favoriteButton.dataset.productId = String(product.id);
  favoriteButton.setAttribute('aria-pressed', String(isFavorite(product.id)));
  favoriteButton.setAttribute('aria-label', `В избранное: ${product.title}`);
  favoriteButton.textContent = isFavorite(product.id) ? '♥' : '♡';

  actions.append(detailsLink, button);

  card.append(favoriteButton, image, category, title, rating, description, price, status, actions);

  return card;
}

function renderProducts(productsToRender) {
  productsContainer.textContent = '';

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = productsToRender.length > 0;
  }

  productsToRender.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.append(card);
  });
}

function getPageCount(itemsCount) {
  return Math.max(1, Math.ceil(itemsCount / PRODUCTS_PER_PAGE));
}

function getPageProducts(productsList, page) {
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  return productsList.slice(start, start + PRODUCTS_PER_PAGE);
}

function renderPagination(pageCount) {
  if (!paginationContainer) {
    return;
  }

  paginationContainer.textContent = '';
  paginationContainer.hidden = pageCount <= 1;

  for (let page = 1; page <= pageCount; page += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('pagination__button');
    button.textContent = String(page);
    button.dataset.page = String(page);
    button.setAttribute('aria-label', `Страница ${page}`);

    if (page === catalogState.page) {
      button.classList.add('pagination__button--active');
      button.setAttribute('aria-current', 'page');
    }

    paginationContainer.append(button);
  }
}

function updateCatalog() {
  const preparedProducts = getPreparedProducts(products, catalogState);
  const pageCount = getPageCount(preparedProducts.length);

  if (catalogState.page > pageCount) {
    catalogState.page = pageCount;
  }

  renderProducts(getPageProducts(preparedProducts, catalogState.page));

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${preparedProducts.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = preparedProducts.length > 0;
  }

  renderPagination(pageCount);
}

function resetPageAndUpdate() {
  catalogState.page = 1;
  updateCatalog();
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    resetPageAndUpdate();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', (event) => {
    catalogState.category = event.target.value;
    resetPageAndUpdate();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    resetPageAndUpdate();
  });
}

if (favoritesOnlyCheckbox) {
  favoritesOnlyCheckbox.addEventListener('change', (event) => {
    catalogState.onlyFavorites = event.target.checked;
    resetPageAndUpdate();
  });
}

if (paginationContainer) {
  paginationContainer.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page]');

    if (!button) {
      return;
    }

    catalogState.page = Number(button.dataset.page);
    updateCatalog();
    productsContainer.scrollIntoView({ block: 'start' });
  });
}

if (productsContainer) {
  updateFavoritesCount();
  updateCatalog();
}

if (productsContainer) {
  productsContainer.addEventListener('click', (event) => {
    const favoriteButton = event.target.closest('[data-action="toggle-favorite"]');

    if (favoriteButton) {
      toggleFavorite(Number(favoriteButton.dataset.productId));
      updateFavoritesCount();
      updateCatalog();
      return;
    }

    const button = event.target.closest('[data-action="add-to-cart"]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);
    const selectedProduct = products.find((product) => product.id === productId);

    if (!selectedProduct) {
      console.warn('Товар не найден:', productId);
      return;
    }

    const isAdded = addToCart(productId);

    if (catalogMessage && isAdded) {
      catalogMessage.textContent = `Товар «${selectedProduct.title}» добавлен в корзину.`;
    }
  });
}
