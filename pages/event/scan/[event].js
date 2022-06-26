import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BACKGROUND, getSize, SECONDARY } from "../../../util/theme.js";
import { useWeb3React } from "@web3-react/core";
import LoadingView from "../../../components/LoadingView.js";
import dynamic from "next/dynamic";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import { getNFTContract, requestFunction } from "../../../util/common.js";
import { getEventId, useAlert } from "../../../util/hooks.js";
import sha256 from "crypto-js/sha256";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const QrRead = dynamic(() => import("react-qr-scanner"), {
  ssr: false,
});

const ScanPage = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { account } = useWeb3React();
  const eventId = getEventId();
  const { setAlert } = useAlert();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState();

  const handleScan = (data) => {
    if (data) {
      setData(JSON.parse(data?.text));
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    if (data) {
      auth();
    }
  }, [data]);

  const auth = async () => {
    console.log(data);
    if (!data.password || !data.account) {
      setAuthState("fail");
      return;
    }

    const hash = sha256(data.account + data.password);
    const buffer = Buffer.from(hash.toString(), "hex");
    const bytes = new Uint8Array(buffer);
    const hexHash = toHexString(bytes);

    const contract = getNFTContract();

    await requestFunction({
      func: async () => {
        setLoading(true);
        const password = await contract.getPassword(eventId, data.account);
        if (password === hexHash) {
          setAuthState("success");
        } else {
          setAuthState("fail");
        }
      },
      failMessage: () =>
        setAlert({ message: "Failed to fetch", type: "error" }),
    });

    setLoading(false);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={10}
      marginBottom={5}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box textAlign="center">
          <Typography
            variant="h2"
            fontSize={titleSize}
            color="black"
            fontWeight={400}
          >
            Scan Ticket
          </Typography>
          <Typography variant="h2" fontSize={textSize} color="black">
            Scan a ticket to check elgibility
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
          <QrRead
            onError={handleError}
            onScan={handleScan}
            style={{ height: "100%", width: "100%" }}
          />
          <Box position="absolute">
            {authState === "fail" ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <DoNotDisturbOnIcon
                  color="error"
                  sx={{ fontSize: titleSize * 3 }}
                />
              </Box>
            ) : authState === "success" ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <CheckCircleIcon
                  color="success"
                  sx={{ fontSize: titleSize * 3 }}
                />
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function toHexString(byteArray) {
  return (
    "0x" +
    Array.from(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("")
  );
}

export default ScanPage;
