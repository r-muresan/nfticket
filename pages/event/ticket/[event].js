import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { BACKGROUND, getSize, SECONDARY } from "../../../util/theme.js";
import Button from "@mui/material/Button";
import ConstructionIcon from "@mui/icons-material/Construction";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatDistance } from "date-fns";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import QRCode from "react-qr-code";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router.js";
import TextField from "@mui/material/TextField";
import LoadingView from "../../../components/LoadingView.js";

const TicketPage = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { account } = useWeb3React();
  const router = useRouter();
  const userAccount = account || router.query.account;

  const [password, setPassword] = useState("");

  const copyUrl = () => {
    let url = window.location.href;
    url += `?account=${userAccount}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={10}
      marginBottom={5}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width={300}
        gap={4}
      >
        <Box textAlign="center">
          <Typography
            variant="h2"
            fontSize={titleSize}
            color="black"
            fontWeight={400}
          >
            Your Ticket
          </Typography>
          <Typography variant="h2" fontSize={textSize} color="black">
            Present this to the event
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box padding={4} borderRadius={8} bgcolor={SECONDARY}>
            {userAccount ? (
              <QRCode
                width={500}
                height={500}
                value={JSON.stringify({
                  account: userAccount,
                  password,
                })}
              />
            ) : (
              <LoadingView />
            )}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap={1} width="100%">
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={copyUrl}>
            Copy URL
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketPage;
