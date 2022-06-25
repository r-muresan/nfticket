import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  getGovernanceContract,
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
      },
      failMessage: () =>
        setAlert({ message: "Could not get proposals.", type: "error" }),
    });
    setLoading(false);
  };

  return { loading, proposals };
};
