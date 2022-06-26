import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  getGovernanceContract,
  getGovernanceContractSignature,
  getNFTContract,
  getNFTContractSignature,
  parseEvent,
  requestFunction,
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
        const proposals = await contract.getProposals(eventId);
        
        setProposals(proposals);
        console.log("DONE");
      },
      failMessage: () =>
        setAlert({ message: "Could not get proposals.", type: "error" }),
    });
    setLoading(false);
  };

  const addProposal = async (proposal) => {
    if (!account){
      setAlert ({message: "no account", type: "error"});
      return;
    }

    const contract = getGovernanceContractSignature(library.getSigner());

    await requestFunction({
      func: async () => {
        setLoading(true)
        const newProposal = contract.submitProposal(0, "get robert a cape", 1658822915, ["yes", "no"]);
        console.log(newProposal);
      },
      failMessage: () =>
        setAlert({ message: "Could not submit proposal.", type: "error" }),
    })
    setLoading(false)
  }

  return { loading, proposals, addProposal };
}
