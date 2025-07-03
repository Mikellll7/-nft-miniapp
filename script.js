<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NFT Маркет</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      padding: 20px;
    }
    h1 {
      text-align: center;
    }
    .nft-list {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }
    .nft-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      width: 200px;
      text-align: center;
      padding: 10px;
    }
    .nft-card img {
      max-width: 100%;
      border-radius: 4px;
    }
    .buy-btn {
      margin-top: 10px;
      padding: 6px 12px;
      background: #007aff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .address-input {
      margin-top: 10px;
      display: none;
    }
  </style>
</head>
<body>
  <h1>Коллекция NFT-марок</h1>
  <div class="nft-list" id="nftList"></div>

  <script src="script.js"></script>
</body>
</html>
