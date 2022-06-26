import sha256 from "crypto-js/sha256";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getSize } from "../../util/theme";
import { useSingleEvent } from "../../util/NFTContractInterface";
import LoadingView from "../../components/LoadingView";
import Image from "next/image";
import { formatRelative } from "date-fns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import { useWeb3React } from "@web3-react/core";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SettingsIcon from "@mui/icons-material/Settings";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import randomWords from "random-words";
import { SECONDARY } from "../../util/theme";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LinkIcon from "@mui/icons-material/Link";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { formatAddress, getENS } from "../../util/common";
import { getEventId } from "../../util/hooks";

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const {
    loading,
    event,
    totalSupply,
    isClaimed,
    claimTicket,
    setPassword,
    addToWhitelist,
  } = useSingleEvent();
  const { account } = useWeb3React();
  const eventId = getEventId();
  const [ens, setEns] = useState("");

  useEffect(() => {
    if (event && !ens) {
      getEns();
    }
  }, [event]);

  const getEns = async () => {
    const address = event.host;
    const ens = await getENS(address);
    setEns(ens);
  };

  if (loading || !event) {
    return (
      <Box height="calc(100vh - 48px)">
        <LoadingView />
      </Box>
    );
  }

  const ControlPanel =
    account === event.host ? (
      <AdminControl event={event} onSubmit={addToWhitelist} />
    ) : event.hasWhitelist && event.whitelisted.includes(account) ? (
      <ClaimTicket
        event={event}
        onClaim={claimTicket}
        isClaimed={isClaimed}
        setPassword={setPassword}
        whitelisted
      />
    ) : event.hasWhitelist && account ? (
      <Box display="flex" alignItems="center" flexDirection="column">
        <DoNotDisturbIcon sx={{ fontSize: titleSize }} />
        <Typography fontSize={subtitleSize} fontWeight={500}>
          Sorry, you are not whitelisted
        </Typography>
      </Box>
    ) : account ? (
      <ClaimTicket
        event={event}
        onClaim={claimTicket}
        isClaimed={isClaimed}
        setPassword={setPassword}
      />
    ) : (
      <Box display="flex" alignItems="center" flexDirection="column">
        <AccountBalanceWalletIcon sx={{ fontSize: titleSize }} />
        <Typography fontSize={subtitleSize} fontWeight={500}>
          Sign in to claim your ticket
        </Typography>
      </Box>
    );

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
        maxWidth={1000}
        width="100%"
        justifyContent="space-between"
        gap={6}
      >
        <Box>
          <Box width={400} height={400} position="relative" marginBottom={4}>
            {event.image && (
              <Image
                src={
                  event.image ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                }
                layout="fill"
                objectFit="cover"
                className="rounded_md"
              />
            )}
          </Box>
          <Typography
            variant="h2"
            fontSize={subtitleSize}
            color="black"
            fontWeight={400}
          >
            {event.name}
          </Typography>
          <Typography
            variant="h2"
            fontSize={textSize}
            color="black"
            fontWeight={300}
          >
            {event.description}
          </Typography>

          <Box display="flex" gap={1} alignItems="center" marginTop={4}>
            <AccountCircleIcon />
            <Typography
              variant="h2"
              fontSize={textSize}
              color="black"
              fontWeight={400}
            >
              {ens || formatAddress(event.host)}
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <PeopleIcon />
            <Typography
              variant="h2"
              fontSize={textSize}
              color="black"
              fontWeight={400}
            >
              {`${totalSupply}/${event.maxParticipants}`}
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <AccessTimeIcon />
            <Typography
              variant="h2"
              fontSize={textSize}
              color="black"
              fontWeight={400}
            >
              {formatRelative(event.eventDate, new Date())}
            </Typography>
          </Box>
          {event.link && (
            <Box display="flex" gap={1} alignItems="center">
              <LinkIcon />
              <Link href={event.link} color="inherit" underline="none">
                <Typography
                  variant="h2"
                  fontSize={textSize}
                  color="black"
                  fontWeight={400}
                >
                  {event.link}
                </Typography>
              </Link>
            </Box>
          )}
          <Box marginY={2} width="100%" display="flex" gap={2}>
            <Button variant="contained" href={`/event/vote/${eventId}`}>
              Governance
            </Button>
            {account === event.host && (
              <Button variant="contained" href={`/event/scan/${eventId}`}>
                Scan Ticket
              </Button>
            )}
            {isClaimed && (
              <Button variant="contained" href={`/event/ticket/${eventId}`}>
                Show Ticket
              </Button>
            )}
          </Box>
          <iframe
            width={400}
            height={400}
            src={`https://maps.google.com/maps?&q=${event.location}&output=embed`}
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="rounded_md"
          />
        </Box>
        <Box
          width="100%"
          maxWidth={500}
          display="flex"
          justifyContent="center"
          mt={8}
        >
          {ControlPanel}
        </Box>
      </Box>
    </Box>
  );
};

const AdminControl = ({ event, onSubmit }) => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const [whitelisted, setWhitelisted] = useState("");

  const parsedWhitelisted = whitelisted.split(",");

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <SettingsIcon sx={{ fontSize: titleSize }} />
      <Typography fontSize={subtitleSize} fontWeight={500}>
        Configure your event
      </Typography>

      {event.hasWhitelist ? (
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          gap={2}
          marginTop={2}
        >
          <Typography fontSize={textSize}>
            Input the wallet addresses of the people you want to whitelist,
            seperated by commas
          </Typography>
          <TextField
            label="Whitelisted addresses"
            value={whitelisted}
            fullWidth
            multiline
            minRows={3}
            onChange={(e) => setWhitelisted(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={() => onSubmit(parsedWhitelisted)}
          >
            Submit Addresses
          </Button>
        </Box>
      ) : (
        <Typography>No whitelist</Typography>
      )}
    </Box>
  );
};

const ClaimTicket = ({
  event,
  isClaimed,
  onClaim,
  setPassword,
  whitelisted,
}) => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { account } = useWeb3React();

  const randomWord = randomWords().toLowerCase();

  const hash = sha256(account + randomWord);
  const buffer = Buffer.from(hash.toString(), "hex");
  const bytes = new Uint8Array(buffer);

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      {isClaimed ? (
        <Box>
          <Box display="flex" alignItems="center" flexDirection="column">
            <ConfirmationNumberIcon sx={{ fontSize: titleSize }} />
            <Typography fontSize={subtitleSize} fontWeight={500}>
              Reset secret word
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            gap={2}
          >
            <Typography fontSize={textSize} fontWeight={300}>
              A new secret word will be used to claim your ticket:
            </Typography>
            <Box
              bgcolor={SECONDARY}
              paddingY={4}
              borderRadius={2}
              textAlign="center"
              width="100%"
            >
              <Typography fontSize={subtitleSize} fontWeight={400}>
                {randomWord}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setPassword(bytes)}
            >
              Set Secret Word
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" flexDirection="column">
            <ConfirmationNumberIcon sx={{ fontSize: titleSize }} />
            <Typography fontSize={subtitleSize} fontWeight={500}>
              Claim your ticket {whitelisted && "(Whitelisted)"}
            </Typography>
          </Box>
          <Button variant="contained" fullWidth onClick={onClaim}>
            Claim Ticket
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Event;
