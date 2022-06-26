export const DEFAULT_CHAIN = {
  chainId: "0x13881",
  rpcUrls: ["https://rpc-mumbai.matic.today"],
  chainName: "Polygon Testnet",
  nativeCurrency: { name: "Polygon", decimals: 18, symbol: "MATIC" },
  blockExplorerUrls: [
    "https://polygon-mumbai.g.alchemy.com/v2/UjHpXzEvZmOKLR60ng-8RJx66mbIsv4h",
  ],
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"],
};

export const NFT_CONTRACT_ADDRESS =
  "0x3CA0F9f690b526DECA333542791f072EB4074Fa2";
export const GOVERNANCE_CONTRACT_ADDRESS =
  "0xa2DD92c2D0933878C83A24fA8DD8EB4919344CC8";
export const RPC_URL =
  "https://polygon-mumbai.g.alchemy.com/v2/UjHpXzEvZmOKLR60ng-8RJx66mbIsv4h";

export const networkParams = {
  "0x13881": DEFAULT_CHAIN,
};
