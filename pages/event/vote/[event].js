import sha256 from "crypto-js/sha256";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getSize, PRIMARY, SECONDARY } from "../../../util/theme";
import { useSingleEvent } from "../../../util/NFTContractInterface";
import LoadingView from "../../../components/LoadingView";
import { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { useGovernanceContract } from "../../../util/GovernanceContractInterface";

function CustomSelect() {
  const [score, setScore] = useState("");
  const inputComponent = useRef(null);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    setPosition(
      inputComponent.current
        ? inputComponent.current.getBoundingClientRect().left + 30
        : 0
    );
  }, [inputComponent]);

  const scoreData = ["100", "90", "80", "70", "60"];

  const handleChange = (event) => {
    setScore(event.target.value);
  };

  return (
    <FormControl sx={{ width: 200, marginRight: "20px" }}>
      {/* Supplies text for label */}
      {score ? <InputLabel id="custom-select-label">Score</InputLabel> : ""}
      <Select
        ref={inputComponent}
        labelId="custom-select-label"
        id="custom-select"
        value={score}
        label={score ? "Score" : ""} //This tells Select to have gap in border
        onChange={handleChange}
        displayEmpty
        renderValue={(value) => (value ? value : <em>Nothing Selected</em>)}
        MenuProps={{
          PaperProps: { sx: { left: `${position}px !important` } },
        }}
      >
        {/*Don't add a placeholder, instead use renderValue to control emptry value text */}
        {scoreData.map((scoreValue) => {
          return <MenuItem value={scoreValue}>{scoreValue}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}

const IsActive = (eventArray) => {
  const activeProposals = eventArray.filter(
    (proposal) => proposal.voteDelay + prosposal.creationTime < Date.now()
  );
  const inactiveProposals = eventArray.filter(
    (proposal) => proposal.voteDelay + prosposal.creationTime > Date.now()
  );
  return { activeProposals, inactiveProposals };
};

const SetProposals = (eventArray) => {
  const { activeProposals, inactiveProposals } = isActive(eventArray);
  for (let i = 0; i < activeProposals.length; i++) {
    return <activeEvent event={activeProposals[i]} />;
  }

  for (let i = 0; i < inactiveProposals.length; i++) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        maxWidth={1000}
        width="100%"
      ></Box>
    );
  }
};

const ActiveEvent = (event) => {
  return (
    <Box>
      <Typography variant="h4" color="black" fontWeight={400} marginTop={5}>
        Active Proposals
      </Typography>
      <Box height={200} overflow={"auto"} sx={{ border: 1 }}>
        <Box
          sx={{ border: 1 }}
          borderRadius={"16px"}
          height={150}
          p={2}
          boxShadow={4}
          bgcolor={SECONDARY}
        >
          <Typography>Event: </Typography>
          <Typography>Host: </Typography>
          <Typography>Proposal:</Typography>
          <CustomSelect> </CustomSelect>
          <Button variant="contained">Vote</Button>
        </Box>
        <Box
          sx={{ border: 1 }}
          borderRadius={"16px"}
          height={150}
          p={2}
          boxShadow={4}
          bgcolor={SECONDARY}
        >
          <Typography>Event: </Typography>
          <Typography>Host: </Typography>
          <Typography>Proposal:</Typography>
          <CustomSelect> </CustomSelect>
          <Button variant="contained">Vote</Button>
        </Box>
      </Box>
    </Box>
  );
};

const inactiveEvent = (event) => {
  return (
    <Box>
      <Typography variant="h4" color="black" fontWeight={400} marginTop={5}>
        {" "}
        Past Proposals{" "}
      </Typography>
      <Box height={200} overflow={"auto"} sx={{ border: 1 }}>
        <Box
          sx={{ border: 1 }}
          borderRadius={"16px"}
          height={150}
          p={2}
          boxShadow={4}
          bgcolor={SECONDARY}
        >
          <Typography>Event: </Typography>
          <Typography>Host: </Typography>
          <Typography>Proposal:</Typography>
          <Typography>Outcome:</Typography>
        </Box>
        <Box
          sx={{ border: 1 }}
          borderRadius={"16px"}
          height={150}
          p={2}
          boxShadow={4}
          bgcolor={SECONDARY}
        >
          <Typography>Event: </Typography>
          <Typography>Host: </Typography>
          <Typography>Proposal:</Typography>
          <Typography>Outcome:</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const EventDetails = ({ event }) => {
  return (
    <Box>
      <Typography variant="h4" color="black" fontWeight={400} marginTop={5}>
        Event Details
      </Typography>

      <Box
        sx={{ border: 1 }}
        borderRadius={"16px"}
        height={150}
        p={2}
        boxShadow={3}
        bgcolor={SECONDARY}
      >
        <Typography marginBottom={1}>Name: {event.name} </Typography>
        <Typography marginBottom={1}>Host: {event.host} </Typography>
        <Typography marginBottom={1}>
          Date: {event.eventDate.toString()}
        </Typography>
        <Typography>Location{event.location}</Typography>
      </Box>
    </Box>
  );
};

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, event } = useSingleEvent();
  const { loading: loadingProposals, proposals } = useGovernanceContract();

  console.log(proposals);

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
        <EventDetails event={event} />
      </Box>
    </Box>
  );
};

export default Event;
