import { numberToHex } from "web3-utils";

export const NFT_CONTRACT_ADDRESS =
  "0xA2c4042B279409eE3E918Cb96aD472267025EAd7";
export const GOVERNANCE_CONTRACT_ADDRESS =
  "0xa2DD92c2D0933878C83A24fA8DD8EB4919344CC8";
export const RPC_URL_WS =
  "wss://hackathon.skalenodes.com/v1/ws/hoarse-well-made-theemim";
export const RPC_URL =
  "https://hackathon.skalenodes.com/v1/downright-royal-saiph";

export const DEFAULT_CHAIN = {
  chainId: "0x1e783a2",
  rpcUrls: [RPC_URL],
  chainName: "Skale Testnet",
  nativeCurrency: { name: "Skale", decimals: 18, symbol: "sFuel" },
  blockExplorerUrls: [
    "https://polygon-mumbai.g.alchemy.com/v2/UjHpXzEvZmOKLR60ng-8RJx66mbIsv4h",
  ],
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"],
};
export const networkParams = {
  "0x1e783a2": DEFAULT_CHAIN,
};
