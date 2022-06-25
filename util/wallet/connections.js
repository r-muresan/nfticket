import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { networkParams } from "./network";
import { hexToNumber } from "web3-utils";

const supportedChainIds = Object.entries(networkParams).map(([key, value]) =>
  hexToNumber(value.chainId)
);

export const CoinbaseWallet = new WalletLinkConnector({
  appName: "NFTicket App",
  supportedChainIds,
});

export const WalletConnect = new WalletConnectConnector({
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

export const Injected = new InjectedConnector({
  supportedChainIds,
});

export const connectors = {
  injected: Injected,
  walletConnect: WalletConnect,
  coinbaseWallet: CoinbaseWallet,
};
