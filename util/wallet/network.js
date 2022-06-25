const POLYGON = {
  chainId: "0x89",
  rpcUrls: ["https://polygon-rpc.com"],
  chainName: "Polygon Mainnet",
  nativeCurrency: { name: "Polygon", decimals: 18, symbol: "MATIC" },
  blockExplorerUrls: ["https://www.polygonscan.com"],
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"],
};

export const POLYGON_MUMBAI = {
  chainId: "0x13881",
  rpcUrls: ["https://rpc-mumbai.matic.today"],
  chainName: "Polygon Testnet",
  nativeCurrency: { name: "Polygon", decimals: 18, symbol: "MATIC" },
  blockExplorerUrls: [
    "https://polygon-mumbai.g.alchemy.com/v2/UjHpXzEvZmOKLR60ng-8RJx66mbIsv4h",
  ],
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"],
};

export const networkParams = {
  "0x13881": POLYGON_MUMBAI,
};
