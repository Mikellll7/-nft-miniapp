const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Твой адрес для комиссии (3%)
const PLATFORM_WALLET = 'UQDYFZmFZs2zQJwFm4xTlg85xzT8b4cCDJFcMVyIz7yWdjID';

app.use(bodyParser.json());

// Пример базы данных (можно заменить на MongoDB или Firestore)
let products = [
  {
    id: '001',
    title: 'Балтийский корабль',
    priceTON: 10,
    priceUSDT: 12,
    image: 'https://raw.githubusercontent.com/твоя-ссылка/nft-miniapp/main/nft001.jpg',
    sellerWallet: '', // Продавец укажет сам
    exclusive: false
  },
  {
    id: '002',
    title: 'Эксклюзивный корабль',
    priceTON: 300,
    priceUSDT: 330,
    image: 'https://raw.githubusercontent.com/твоя-ссылка/nft-miniapp/main/nft002.jpg',
    sellerWallet: '',
    exclusive: true
  }
];

// Получение товаров
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Продавец обновляет свой кошелек
app.post('/api/set-wallet', (req, res) => {
  const { sellerId, wallet } = req.body;
  products = products.map(p =>
    p.sellerId === sellerId ? { ...p, sellerWallet: wallet } : p
  );
  res.json({ success: true });
});

// Заказ NFT
app.post('/api/order', (req, res) => {
  const { productId, userId, deliveryAddress, paymentCurrency } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'NFT не найден' });
  }

  const amount = paymentCurrency === 'TON' ? product.priceTON : product.priceUSDT;
  const sellerWallet = product.sellerWallet;
  if (!sellerWallet) {
    return res.status(400).json({ error: 'Кошелёк продавца не указан' });
  }

  // Расчёт комиссий
  const sellerAmount = (amount * 0.97).toFixed(2);
  const platformAmount = (amount * 0.03).toFixed(2);

  // Возвращаем инструкции для оплаты
  res.json({
    payment: {
      currency: paymentCurrency,
      totalAmount: amount,
      payToSeller: sellerWallet,
      sellerAmount,
      payToPlatform: PLATFORM_WALLET,
      platformAmount
    },
    delivery: product.exclusive ? { required: true, address: deliveryAddress || '' } : { required: false },
    message: 'Заказ успешно сформирован'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`NFT сервер запущен на порту ${PORT}`);
});
