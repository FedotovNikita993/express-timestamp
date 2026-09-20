const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Исходный массив продуктов
let products = [
  { id: 1, name: 'Phone', price: 500, category: 'Electronics', image: '' }
];

// 4 & 5. Функция добавления продукта, возвращающая Promise
function addProduct(newProduct, failQuery) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Имитация ошибки при query-параметре fail=true
      if (failQuery === 'true') {
        return reject(new Error('Failed to save product'));
      }

      const product = {
        id: Date.now(),
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
        image: newProduct.image || '' // если необязательное поле image не передано — пустая строка
      };

      products.push(product);
      resolve(product);
    }, 200);
  });
}

// Старые эндпоинты с прошлого ДЗ
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/stats', (req, res) => {
  res.json({
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// 2, 3 & 5. POST /products с валидацией и обработкой асинхронной ошибки
app.post('/products', async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    // 3. Валидация обязательных полей
    if (!name || typeof name !== 'string' || name.trim() === '' ||
        price === undefined || typeof price !== 'number' || price <= 0 ||
        !category || typeof category !== 'string' || category.trim() === '') {
      return res.status(422).json({ error: 'Invalid product data' });
    }

    // 3. Проверка на дубликат названия
    const isDuplicate = products.some(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (isDuplicate) {
      return res.status(409).json({ error: 'Conflict: product name already exists' });
    }

    // Вызов асинхронной функции через async/await
    const createdProduct = await addProduct({ name, price, category, image }, req.query.fail);

    return res.status(201).json(createdProduct);
  } catch (error) {
    // Ошибка при reject() из Promise
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /products для проверки результатов POST
app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});