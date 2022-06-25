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

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, event, totalSupply } = useSingleEvent();

  console.log(event);

  if (loading) {
    return (
      <Box height="calc(100vh - 48px)">
        <LoadingView />
      </Box>
    );
  }

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
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            className="rounded_md"
          />
        </Box>
        <Box></Box>
      </Box>
    </Box>
  );
};

export default Event;
