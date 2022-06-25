import Head from "next/head";
import React from "react";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { theme } from "../util/theme";
import AppNav from "../components/AppNav";
import AlertProvider from "../components/Providers/AlertProvider";
import Box from "@mui/material/Box";
import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const BaseWrapper = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="manifest" href="manifest.json" />
          <meta name="theme-color" content="#3500d3" />
          <meta
            name="description"
            content="Coblox is First-Ever 3D, Cooperative NFT Builder. The community creates the NFTs and determines their price. Make your mark by placing a block."
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/icon_apple.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/icon32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/icon16.png"
          />

          <meta name="twitter:title" content="Coblox" />
          <meta
            name="twitter:description"
            content="Coblox is First-Ever 3D, Cooperative NFT Builder. The community creates the NFTs and determines their price. Make your mark by placing a block."
          />
          <meta name="twitter:url" content="https://www.coblox.app/" />
          <meta
            name="twitter:card"
            content="The First-Ever 3D, Cooperative NFT Builder"
          />
          <title>Coblox</title>
        </Head>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const App = ({ Component, pageProps }) => {
  if (Component.removeNavBar) {
    return (
      <BaseWrapper>
        <Component {...pageProps} />
      </BaseWrapper>
    );
  }

  return (
    <BaseWrapper>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AlertProvider>
          <AppNav>
            <Box flex={1} sx={{ overflowY: "auto" }}>
              <Component {...pageProps} />
            </Box>
          </AppNav>
        </AlertProvider>
      </Web3ReactProvider>
    </BaseWrapper>
  );
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}
export default App;
