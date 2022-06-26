import sha256 from "crypto-js/sha256";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getSize, PRIMARY, SECONDARY } from "../../../util/theme";
import { useSingleEvent } from "../../../util/NFTContractInterface";
import LoadingView from "../../../components/LoadingView";
import { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { useGovernanceContract } from "../../../util/GovernanceContractInterface";

function CustomSelect({ proposalId,  options, votes, onVote }) {
  const [score, setScore] = useState("");
  const inputComponent = useRef(null);
  const [position, setPosition] = useState(0);
  const [scoreData, setScoreData] = useState(options);


  const onSubmit = () => {
    onVote(proposalId, score);
  }

  const handleChange = (event) => {
    setScore(event.target.value);
  };

  useEffect(() => {
    setPosition(
      inputComponent.current
        ? inputComponent.current.getBoundingClientRect().left + 30
        : 0
    );
  }, [inputComponent]);


 

  return (
    <Box>
    <FormControl sx={{ width: 200, marginRight: "20px" }}>
     
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

        {scoreData.map((scoreValue, index) => {
          return (
            <MenuItem value={scoreValue} key={index}>
              {scoreValue}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
    <Button variant="contained" onClick={onSubmit}>Vote</Button>
    </Box>
  );
}

const IsActive = (eventArray) => {
  const activeProposals = eventArray.filter(
    (proposal) => proposal.voteDelay + proposal.creationTime > (Date.now() / 1000)
  );

  return { activeProposals };
};



const Active = ({ proposal, onVote }) => {
  return (
    <Box>
      <Box
        sx={{ border: 1 }}
        borderRadius={"16px"}
        height={150}
        p={2}
        boxShadow={4}
        bgcolor={SECONDARY}
      >
        <Typography>Proposal: {proposal.proposing}</Typography>
        <CustomSelect proposalId = {proposal.id} options = {proposal.options} votes={proposal.votes} onVote={onVote}/> 
      
      </Box>
    </Box>
  );
};
const ActiveProposal = ({ activeProposals, onVote }) => {
  console.log("active proposals", activeProposals);
  return (
    <Box>
      <Typography variant="h4" color="black" fontWeight={400} marginTop={5}>
        Active Proposals
      </Typography>
      <Box height={400} overflow={"auto"} sx={{ border: 1 }}>
        {activeProposals.map((proposal, index) => (
          <Active proposal={proposal} key={index} onVote={onVote} />
        ))}
      </Box>
    </Box>
  );
};

const EventDetails = ({  addProposal }) => {
  const[proposing, setProposition] = useState("");
  const[options, setOptions] = useState([]);
  const[voteDelay, setVoteDelay] = useState(0);
  
  return (
    <Box>
      <Typography variant="h4" color="black" fontWeight={400} marginTop={5}>
        Submit Proposal
      </Typography>

      <Box
        sx={{ border: 1 }}
        borderRadius={"16px"}
        height={150}
        p={2}
        boxShadow={3}
        bgcolor={SECONDARY}
        display="flex"
        gap={2}
      >
      
        <TextField
          label="Proposal"
          value={proposing}
          onChange={(e) => setProposition(e.target.value)}
        />
        <TextField
          label="Options"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
        <TextField
          label="Vote Delay"
          value={voteDelay}
          onChange={(e) => setVoteDelay(e.target.value)}
        />  
        <Button onClick={() => addProposal(proposing, options.split(','), voteDelay)} variant="contained" style={{
          maxWidth: "60px",
          maxHeight: "30px",
          minWidth: "70px",
          minHeight: "35px"
        }}>Submit</Button>
      </Box>
    </Box>
  );
};

const Event = () => {
  const { textSize, subtitleSize, titleSize, isWidescreen } = getSize();
  const { loading, event } = useSingleEvent();
  const {
    loading: loadingProposals,
    proposals,
    addProposal,
    vote
  } = useGovernanceContract();

  if (loading || loadingProposals) {
    return (
      <Box height="calc(100vh - 48px)">
        <LoadingView />
      </Box>
    );
  }

  console.log(proposals, IsActive(proposals).activeProposals);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginTop={10}
      marginBottom={5}
    >
      

      <Box display="flex" flexDirection="column" maxWidth={1000} width="100%">
        <EventDetails event={event} addProposal = {addProposal}/>

        <ActiveProposal activeProposals={IsActive(proposals).activeProposals} onVote={vote} />
     
      </Box>
    </Box>
  );
};

export default Event;
