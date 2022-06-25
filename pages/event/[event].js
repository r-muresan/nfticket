import sha256 from "crypto-js/sha256";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getSize } from "../../util/theme";
import { useSingleEvent } from "../../util/NFTContractInterface";
import LoadingView from "../../components/LoadingView";
import { getEventId } from "../../util/hooks";
import { useRouter } from "next/router";

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, event } = useSingleEvent();

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
      <Box display="flex" maxWidth={1000} width="100%">
        <Box>
          {/* <Image src="" /> */}
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
        </Box>
      </Box>
    </Box>
  );
};

export default Event;
