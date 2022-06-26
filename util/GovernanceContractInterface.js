import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  getGovernanceContract,
  getGovernanceContractSignature,
  getNFTContract,
  getNFTContractSignature,
  parseEvent,
  requestFunction,
  parseProposal,
} from "./common";
import { getEventId, useAlert } from "./hooks";
import { NFTStorage } from "nft.storage";
import { getUnixTime } from "date-fns";

export const useGovernanceContract = () => {
  const eventId = getEventId();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const {account, library} = useWeb3React();
  const { setAlert } = useAlert();

  useEffect(() => {
    if (eventId) {
      getProposals();
    }
  }, [eventId]);

  const getProposals = async () => {
    const contract = getGovernanceContract();

    setLoading(true);
    await requestFunction({
      func: async () => {
        console.log(eventId);
        const proposals = await contract.getProposals(eventId);
        console.log("PROPOSALS BEFORE", proposals);

        setProposals(proposals.map((proposal) => parseProposal(proposal)));
      },
      failMessage: () =>
        setAlert({ message: "Could not get proposals.", type: "error" }),
    });
    setLoading(false);
  };

  const addProposal = async (proposing, options, voteDelay) => {
    if (!account){
      setAlert ({message: "no account", type: "error"});
      return;
    }

    const contract = await getGovernanceContractSignature(library.getSigner());
    console.log("contract addr", contract);
    //const contract2 = await getNFTContractSignature(library.getSigner());
   
    await requestFunction({
      func: async () => {
        setLoading(true)
        const tx = await contract.submitProposal(eventId, proposing, voteDelay, options);
        await tx.wait();
      },
      failMessage: () =>
        setAlert({ message: "Could not submit proposal.", type: "error" }),
    })
    await getProposals();
    setLoading(false)
  }

  const vote = async (proposalId, option) => {
    if (!account){
      setAlert ({message: "no account", type: "error"});
      return;
    }

    const contract = await getGovernanceContractSignature(library.getSigner());
   
    await requestFunction({
      func: async () => {
        setLoading(true)
        const tx = await contract.vote(proposalId, option);
        await tx.wait();
      },
      failMessage: () =>
        setAlert({ message: "Could not vote.", type: "error" }),
    })
    await getProposals();
    setLoading(false)
  }

  return { loading, proposals, addProposal, vote };
}
