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

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, event, totalSupply } = useSingleEvent();
  const { account } = useWeb3React();

  console.log(event);

  if (loading) {
    return (
      <Box height="calc(100vh - 48px)">
        <LoadingView />
      </Box>
    );
  }

  const ControlPanel =
    account === event.host ? (
      <Box>
        <Typography fontSize={subtitleSize} fontWeight={500}>
          Claim your ticket
        </Typography>
      </Box>
    ) : event.hasWhitelist && event.whitelisted.includes(account) ? (
      <Box>
        <Typography fontSize={subtitleSize} fontWeight={500}>
          You are whitelisted, claim your ticket
        </Typography>
      </Box>
    ) : event.hasWhitelist && account ? (
      <Box>
        <Typography fontSize={subtitleSize} fontWeight={500}>
          Sorry, you are not whitelisted
        </Typography>
      </Box>
    ) : account ? (
      <Box>
        <Typography fontSize={subtitleSize} fontWeight={500}>
          Claim your ticket
        </Typography>
      </Box>
    ) : (
      <Box>
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
                src={event.image}
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
          <Box display="flex" gap={1} alignItems="center" marginBottom={4}>
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
        <Box width="100%" display="flex" justifyContent="center" mt={8}>
          {ControlPanel}
        </Box>
      </Box>
    </Box>
  );
};

export default Event;
