const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Кошелек платформы для сбора комиссии
const PLATFORM_WALLET = 'UQDYFZmFZs2zQJwFm4xTlg85xzT8b4cCDJFcMVyIz7yWdjID';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Псевдо-база для хранения заказов и продавцов (в реальном проекте – база данных)
let orders = [];
let sellers = {};

// Получить список всех заказов
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Получить список продавцов
app.get('/api/sellers', (req, res) => {
  res.json(sellers);
});

// Привязка Telegram Wallet продавца
app.post('/api/set-wallet', (req, res) => {
  const { sellerId, wallet } = req.body;
  if (!sellerId || !wallet) return res.status(400).json({ error: 'Неверные данные' });

  sellers[sellerId] = wallet;
  res.json({ success: true });
});

// Получить кошелек продавца
app.get('/api/get-wallet/:sellerId', (req, res) => {
  const sellerId = req.params.sellerId;
  res.json({ wallet: sellers[sellerId] || null });
});

// Обработка покупки
app.post('/api/buy', (req, res) => {
  const { nftId, buyerId, price, currency, isExclusive, address, sellerId } = req.body;

  if (!nftId || !buyerId || !price || !currency) {
    return res.status(400).json({ error: 'Данные покупки неполные' });
  }

  // Комиссия 3% только если продавец есть
  let platformCommission = 0;
  let sellerWallet = null;

  if (sellerId && sellers[sellerId]) {
    platformCommission = price * 0.03;
    sellerWallet = sellers[sellerId];
  }

  const order = {
    nftId,
    buyerId,
    price,
    currency,
    isExclusive: !!isExclusive,
    address: isExclusive ? address : null,
    sellerWallet,
    platformCommission,
    date: new Date().toISOString()
  };

  orders.push(order);
  res.json({ success: true, order });
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
