import sha256 from "crypto-js/sha256";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getSize } from "../../util/theme";
import { useSingleEvent } from "../../util/NFTContractInterface";
import LoadingView from "../../components/LoadingView";

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, event } = useSingleEvent();

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
      <Box display="flex" flexDirection="column" maxWidth={1000} width="100%">
        <Typography
          variant="h2"
          size={titleSize}
          color="black"
          fontWeight={400}
        >
          Event
        </Typography>
      </Box>
    </Box>
  );
};

export default Event;
