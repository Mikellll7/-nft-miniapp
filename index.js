const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('NFT Mini App работает!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
