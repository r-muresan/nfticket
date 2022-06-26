import { numberToHex } from "web3-utils";

export const NFT_CONTRACT_ADDRESS =
  "0x6eb23Fc08E00150599E298C435A12D5bCD1fA636";
export const GOVERNANCE_CONTRACT_ADDRESS =
  "0xa2DD92c2D0933878C83A24fA8DD8EB4919344CC8";
export const RPC_URL = "https://cronos-testnet-3.crypto.org:8545";

export const DEFAULT_CHAIN = {
  chainId: numberToHex(338),
  rpcUrls: [RPC_URL],
  chainName: "Cronos Testnet",
  nativeCurrency: { name: "Cronos", decimals: 18, symbol: "TCRO" },
  blockExplorerUrls: [
    "https://polygon-mumbai.g.alchemy.com/v2/UjHpXzEvZmOKLR60ng-8RJx66mbIsv4h",
  ],
  iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"],
};
export const networkParams = {
  "0x13881": DEFAULT_CHAIN,
};
