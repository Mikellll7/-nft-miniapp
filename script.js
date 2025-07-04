// script.js

Telegram.WebApp.ready();

// Установка цветовой темы в зависимости от темы Telegram
document.body.classList.toggle('dark', Telegram.WebApp.colorScheme === 'dark');

// Покупка NFT
function buyNFT(id) {
  const nft = {
    id: id,
    type: 'nft',
    action: 'buy'
  };
  Telegram.WebApp.sendData(JSON.stringify(nft));
}

// Покупка стикера (другим продавцом)
function buySticker(stickerId) {
  const sticker = {
    id: stickerId,
    type: 'sticker',
    action: 'buy'
  };
  Telegram.WebApp.sendData(JSON.stringify(sticker));
}

// Пример переключения режима вручную по кнопке (если понадобится)
// const themeToggle = document.getElementById('toggleTheme');
// themeToggle.onclick = () => {
//   document.body.classList.toggle('dark');
// };
