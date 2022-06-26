import React, { useEffect, useState } from "react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../util/wallet/connections";
import { getSize } from "../util/theme";
import { formatAddress } from "../util/common";
import Image from "next/image";
import { networkParams, POLYGON_MUMBAI } from "../util/wallet/network";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const AppNav = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { textSize, subtitleSize, isWidescreen } = getSize();
  const { activate, account, deactivate, active } = useWeb3React();

  const DRAWER_WIDTH = 240;

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) {
      activate(connectors[provider]);
      setTimeout(doubleCheck, 200);
    }
  }, []);

  const doubleCheck = () => {
    if (!active) {
      const provider = window.localStorage.getItem("provider");
      activate(connectors[provider]);
    }
  };

  const requestNetworkSwitch = async () => {
    const chainId = POLYGON_MUMBAI.chainId;
    const ethereum = window?.ethereum;
    if (!ethereum) return;
    try {
      const tx = await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: networkParams[chainId],
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const defaultDrawerContent = (
    <Box width={DRAWER_WIDTH}>
      <List>
        <ListItem>
          <Box textAlign="center" width="100%">
            <Typography fontSize={textSize} fontWeight={500}>
              Networks
            </Typography>
            <Typography fontSize={textSize - 5}>Select a network</Typography>
          </Box>
        </ListItem>
        <List disablePadding>
          <ListItemButton
            onClick={() => {
              window.location.href = "https://nfticket.lol/events";
            }}
          >
            <ListItemIcon>
              <Image src="/icons/polygon.png" width="30px" height="30px" />
            </ListItemIcon>
            <ListItemText primary="Polygon" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              window.location.href = "https://skale.nfticket.lol/events";
            }}
          >
            <ListItemIcon>
              <Image src="/icons/skale.png" width="30px" height="30px" />
            </ListItemIcon>
            <ListItemText primary="Skale" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              window.location.href = "https://cronos.nfticket.lol/events";
            }}
          >
            <ListItemIcon>
              <Image src="/icons/cronos.png" width="30px" height="30px" />
            </ListItemIcon>
            <ListItemText primary="Cronos" />
          </ListItemButton>

          <ListItem sx={{ marginTop: 2 }}>
            <Box textAlign="center" width="100%">
              <Typography fontSize={textSize} fontWeight={500}>
                Login
              </Typography>
              <Typography fontSize={textSize - 5}>
                Connect with a supported method
              </Typography>
            </Box>
          </ListItem>
          <List disablePadding>
            <ListItemButton
              onClick={async () => {
                await activate(connectors.injected);
                setProvider("injected");
                if (!account) {
                  await requestNetworkSwitch();
                }
              }}
            >
              <ListItemIcon>
                <Image src="/icons/metamask.png" width="30px" height="30px" />
              </ListItemIcon>
              <ListItemText primary="Metamask" />
            </ListItemButton>
            <ListItemButton
              onClick={async () => {
                await activate(connectors.coinbaseWallet);
                setProvider("coinbaseWallet");
                if (!account) {
                  await requestNetworkSwitch();
                }
              }}
            >
              <ListItemIcon>
                <Image src="/icons/coinbase.png" width="30px" height="30px" />
              </ListItemIcon>
              <ListItemText primary="Coinbase Wallet" />
            </ListItemButton>
            <ListItemButton
              onClick={async () => {
                await activate(connectors.walletConnect);
                setProvider("walletConnect");
                if (!account) {
                  await requestNetworkSwitch();
                }
              }}
            >
              <ListItemIcon>
                <Image
                  src="/icons/walletConnect.png"
                  width="30px"
                  height="30px"
                />
              </ListItemIcon>
              <ListItemText primary="Wallet Connect" />
            </ListItemButton>
          </List>
        </List>
      </List>
    </Box>
  );

  const drawerContentLoggedIn = (
    <Box width={DRAWER_WIDTH}>
      <List>
        <ListItem>
          <ListItemIcon>
            <AccountBalanceWalletIcon
              color="dark"
              sx={{ fontSize: subtitleSize }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Wallet connected"
            secondary={formatAddress(account ?? "")}
          />
        </ListItem>
        <ListItemButton onClick={deactivate}>
          <ListItemIcon>
            <DoNotDisturbIcon color="dark" sx={{ fontSize: subtitleSize }} />
          </ListItemIcon>
          <ListItemText primary="Disconnect" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box>
      <AppBar position="fixed" color="primary" className="noselect">
        <Toolbar
          variant="dense"
          display="flex"
          sx={{
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <Link href="/" color="inherit" underline="none">
            <Box display="flex" gap={0.5} alignItems="center">
              <ConfirmationNumberIcon size="large" />
              <Typography variant="h5" color="white" fontWeight={500}>
                NFTicket
              </Typography>
            </Box>
          </Link>

          <Box>
            <Button href="/events" color="inversePrimary">
              Events
            </Button>
            <Button href="/yours" color="inversePrimary">
              {isWidescreen ? "Your Tickets" : "Yours"}
            </Button>
            <Button href="/host" color="inversePrimary">
              Host
            </Button>

            <Button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              sx={{
                minHeight: 0,
                minWidth: 0,
                padding: "2px",
                marginLeft: "5px",
              }}
              color="inversePrimary"
            >
              {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={isDrawerOpen} hideBackdrop>
        {account ? drawerContentLoggedIn : defaultDrawerContent}
      </Drawer>

      <Box marginX={4} overflow="auto">
        {children}
      </Box>
    </Box>
  );
};

export default AppNav;
