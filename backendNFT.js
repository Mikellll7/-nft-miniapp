import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// === БАЗА (временно в файле, позже можно MongoDB или Supabase) ===
let db = {
  users: {},
  nfts: [
    {
      id: "nft001",
      title: "Балтийский корабль",
      image: "https://example.com/images/nft001.png",
      priceTON: 5,
      priceUSDT: 10,
      isExclusive: false,
      creatorWallet: "UQAAAAAA...000", // заменится, если продавец другой
    },
  ],
};

// === ПОКУПКА NFT ===
app.post("/buy", async (req, res) => {
  const { userId, nftId, paymentMethod, buyerWallet, shippingAddress } = req.body;

  const nft = db.nfts.find((item) => item.id === nftId);
  if (!nft) return res.status(404).json({ error: "NFT не найдена" });

  const amount = paymentMethod === "TON" ? nft.priceTON : nft.priceUSDT;
  const adminWallet = "UQDYFZmFZs2zQJwFm4xTlg85xzT8b4cCDJFcMVyIz7yWdjID"; // твой кошелек для 3%
  const sellerWallet = nft.creatorWallet;

  const commission = (amount * 0.03).toFixed(2);
  const sellerAmount = (amount * 0.97).toFixed(2);

  // Сохраняем покупку
  if (!db.users[userId]) db.users[userId] = { purchases: [] };
  db.users[userId].purchases.push({
    nftId,
    paymentMethod,
    buyerWallet,
    shippingAddress: nft.isExclusive ? shippingAddress : null,
    date: Date.now(),
  });

  return res.json({
    success: true,
    message: "Покупка зарегистрирована",
    payment: {
      currency: paymentMethod,
      totalAmount: amount,
      toSeller: sellerAmount,
      toAdmin: commission,
      sellerWallet,
      adminWallet,
    },
  });
});

// === ЛИЧНЫЙ КАБИНЕТ ===
app.get("/user/:userId", (req, res) => {
  const user = db.users[req.params.userId];
  if (!user) return res.json({ purchases: [] });

  const detailedNFTs = user.purchases.map((purchase) => {
    const nft = db.nfts.find((item) => item.id === purchase.nftId);
    return { ...nft, ...purchase };
  });

  res.json({ purchases: detailedNFTs });
});

// === ДОБАВЛЕНИЕ NFT ПРОДАВЦОМ ===
app.post("/create-nft", (req, res) => {
  const { id, title, image, priceTON, priceUSDT, isExclusive, creatorWallet } = req.body;

  if (db.nfts.find((n) => n.id === id)) {
    return res.status(400).json({ error: "Такой ID уже есть" });
  }

  db.nfts.push({
    id,
    title,
    image,
    priceTON,
    priceUSDT,
    isExclusive,
    creatorWallet,
  });

  res.json({ success: true, message: "NFT добавлена" });
});

// === СТАРТ СЕРВЕРА ===
app.listen(PORT, () => {
  console.log(`NFT backend запущен на http://localhost:${PORT}`);
});
