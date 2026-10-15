const categoryLabels = {
  smartphones: 'Смартфоны',
  laptops: 'Ноутбуки',
  headphones: 'Наушники',
  accessories: 'Аксессуары'
};

const products = [
  {
    id: 1,
    title: 'Смартфон Galaxy X',
    category: 'smartphones',
    price: 54990,
    discountPercent: 10,
    rating: 4.7,
    isAvailable: true,
    image: 'images/galaxy-x-640.jpg',
    description: '6.5" AMOLED, 128 ГБ, 8 ГБ ОЗУ, тройная камера.'
  },
  {
    id: 2,
    title: 'Смартфон Nova Lite',
    category: 'smartphones',
    price: 21990,
    discountPercent: 0,
    rating: 4.4,
    isAvailable: true,
    image: 'images/nova-lite-640.jpg',
    description: '6.1" IPS, 64 ГБ, ёмкий аккумулятор на 5000 мА·ч.'
  },
  {
    id: 3,
    title: 'Ноутбук ProBook 15',
    category: 'laptops',
    price: 89990,
    discountPercent: 15,
    rating: 4.8,
    isAvailable: true,
    image: 'images/probook-15-640.jpg',
    description: 'Intel Core i7, 16 ГБ, SSD 512 ГБ, экран 15.6".'
  },
  {
    id: 4,
    title: 'Ноутбук AirBook 13',
    category: 'laptops',
    price: 74990,
    discountPercent: 0,
    rating: 4.6,
    isAvailable: false,
    image: 'images/airbook-13-640.jpg',
    description: 'Лёгкий алюминиевый корпус, 8 ГБ, SSD 256 ГБ.'
  },
  {
    id: 5,
    title: 'Наушники AirSound',
    category: 'headphones',
    price: 12990,
    discountPercent: 10,
    rating: 4.6,
    isAvailable: true,
    image: 'images/airsound-640.jpg',
    description: 'Беспроводные, активное шумоподавление, до 30 часов.'
  },
  {
    id: 6,
    title: 'Наушники BassPro',
    category: 'headphones',
    price: 5990,
    discountPercent: 0,
    rating: 4.3,
    isAvailable: false,
    image: 'images/basspro-640.jpg',
    description: 'Проводные мониторные наушники с глубоким басом.'
  },
  {
    id: 7,
    title: 'Смарт-часы FitBand',
    category: 'accessories',
    price: 9990,
    discountPercent: 5,
    rating: 4.5,
    isAvailable: true,
    image: 'images/fitband-640.jpg',
    description: 'AMOLED, GPS, пульсометр, автономность до 7 дней.'
  },
  {
    id: 8,
    title: 'Монитор UltraView 27"',
    category: 'accessories',
    price: 32990,
    discountPercent: 0,
    rating: 4.7,
    isAvailable: true,
    image: 'images/ultraview-27-640.jpg',
    description: '4K, IPS, 144 Гц, тонкие рамки.'
  },
  {
    id: 9,
    title: 'Клавиатура MechPro',
    category: 'accessories',
    price: 6990,
    discountPercent: 20,
    rating: 4.4,
    isAvailable: true,
    image: 'images/mechpro-640.jpg',
    description: 'Механическая клавиатура с RGB-подсветкой.'
  },
  {
    id: 10,
    title: 'Портативная колонка BoomBox',
    category: 'accessories',
    price: 7990,
    discountPercent: 0,
    rating: 4.2,
    isAvailable: false,
    image: 'images/boombox-640.jpg',
    description: 'Влагозащищённая колонка с подсветкой, 20 Вт.'
  }
];
