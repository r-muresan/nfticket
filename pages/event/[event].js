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
import { useState } from "react";
import randomWords from "random-words";
import { SECONDARY } from "../../util/theme";

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, event, totalSupply, isClaimed, claimTicket, setPassword } =
    useSingleEvent();
  const { account } = useWeb3React();

  if (loading || !event) {
    return (
      <Box height="calc(100vh - 48px)">
        <LoadingView />
      </Box>
    );
  }

  const ControlPanel =
    account === event.host ? (
      <AdminControl event={event} />
    ) : event.hasWhitelist && event.whitelisted.includes(account) ? (
      <ClaimTicket
        event={event}
        onClaim={claimTicket}
        isClaimed={isClaimed}
        setPassword={setPassword}
      />
    ) : event.hasWhitelist && account ? (
      <Box display="flex" alignItems="center" flexDirection="column">
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
            fontSize={titleSize}
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
          <Box display="flex" gap={1} alignItems="center" marginTop={2}>
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
          <Box marginY={2}>
            <Button variant="contained" href={`/event/vote/1`}>
              Governance
            </Button>
          </Box>
          <iframe
            width={400}
            height={400}
            src={`http://maps.google.com/maps?&q=${event.location}&output=embed`}
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="rounded_md"
          />
        </Box>
        <Box
          width="100%"
          maxWidth={400}
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

const AdminControl = ({ event }) => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const [whitelisted, setWhitelisted] = useState(event.whitelisted);

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <SettingsIcon sx={{ fontSize: titleSize }} />
      <Typography fontSize={subtitleSize} fontWeight={500}>
        Configure your event
      </Typography>
      {event.hasWhitelist ? (
        <TextField
          label="Whitelisted addresses"
          value={whitelisted}
          multiline
          minRows={3}
          maxRows={5}
          onChange={(e) => setWhitelisted(e.target.value)}
        />
      ) : (
        <Typography>No whitelist</Typography>
      )}
    </Box>
  );
};

const ClaimTicket = ({ event, isClaimed, onClaim, setPassword }) => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { account } = useWeb3React();

  const randomWord = randomWords().toLowerCase();
  const hash = sha256(randomWord + account);

  const onSubmit = () => {};

  return (
    <Box display="flex" alignItems="center" flexDirection="column" gap={4}>
      <Box display="flex" alignItems="center" flexDirection="column">
        <ConfirmationNumberIcon sx={{ fontSize: titleSize }} />
        <Typography fontSize={subtitleSize} fontWeight={500}>
          Claim your ticket
        </Typography>
      </Box>
      {isClaimed ? (
        <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
          <Typography fontSize={textSize} fontWeight={300}>
            Your secret word which will be used to claim your ticket:
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
            onClick={() => setPassword(hash)}
          >
            Set Secret Word
          </Button>
        </Box>
      ) : (
        <Button variant="contained" fullWidth onClick={onClaim}>
          Claim Ticket
        </Button>
      )}
    </Box>
  );
};

export default Event;
