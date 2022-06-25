import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  getNFTContract,
  getNFTContractSignature,
  parseEvent,
  requestFunction,
} from "./common";
import { getEventId, useAlert } from "./hooks";
import { NFTStorage } from "nft.storage";
import { getUnixTime } from "date-fns";
import { ethers } from "ethers";

const client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_STORAGE_API_KEY,
});

export const useMultiEvents = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const contract = getNFTContract();

    await requestFunction({
      func: async () => {
        setLoading(true);
        const events = await contract.getActiveEvents();
        setEvents(events.map((e) => parseEvent(e)));
      },
      callback: () => setLoading(false),
      failMessage: () =>
        setAlert({ message: "Could not get events", type: "error" }),
    });
  };

  return { loading, events };
};

export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const { account, library } = useWeb3React();
  const { setAlert } = useAlert();

  const createEvent = async (
    name,
    description,
    location,
    image,
    date,
    maxParticipants,
    isWhitelisted,
    eventLink
  ) => {
    if (!account) {
      setAlert({ message: "Please connect to a wallet", type: "error" });
      return;
    }
    if (!name || !image || !date) {
      setAlert({ message: "Please fill in all fields", type: "error" });
      return;
    }

    const contract = await getNFTContractSignature(library.getSigner());

    await requestFunction({
      func: async () => {
        const metadata = await client.store({
          name,
          description,
          image,
        });
        console.log(metadata);

        const tx = await contract.createEvent(
          maxParticipants,
          name,
          description,
          metadata.data.image.href,
          location,
          account,
          getUnixTime(date),
          isWhitelisted,
          metadata.url,
          0,
          eventLink
        );
        setLoading(true);

        setAlert({ message: "Please wait", type: "info" });
        await tx.wait();
      },
      successMessage: () =>
        setAlert({
          message: `Event created`,
          type: "success",
        }),
      failMessage: () =>
        setAlert({ message: "Transaction failed", type: "error" }),
    });
    setLoading(false);
  };

  return { loading, createEvent };
};

export const useSingleEvent = () => {
  const eventId = getEventId();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [isClaimed, setIsClaimed] = useState(false);
  const { account, library } = useWeb3React();
  const { setAlert } = useAlert();

  useEffect(() => {
    if (eventId) {
      getEvent();
    }
  }, [eventId]);

  useEffect(() => {
    if (account) {
      checkClaimStatus();
    }
  }, [account]);

  const getEvent = async () => {
    const contract = getNFTContract();

    await requestFunction({
      func: async () => {
        setLoading(true);
        const event = await contract.getEvent(eventId);
        setEvent(parseEvent(event));
      },
      failMessage: () =>
        setAlert({ message: "Could not get event.", type: "error" }),
    });

    await requestFunction({
      func: async () => {
        setLoading(true);
        const supply = await contract.totalSupply(eventId);
        setTotalSupply(parseInt(supply));
      },
      failMessage: () =>
        setAlert({ message: "Could not get supply.", type: "error" }),
    });
    setLoading(false);
  };

  const checkClaimStatus = async () => {
    const contract = getNFTContract();

    await requestFunction({
      func: async () => {
        setLoading(true);
        const isClaimed = await contract.didUserBuy(eventId, account);
        setIsClaimed(isClaimed);
      },
      failMessage: () =>
        setAlert({ message: "Could not get claim status.", type: "error" }),
    });
    setLoading(false);
  };

  const claimTicket = async () => {
    if (!account) {
      setAlert({ message: "Please connect to a wallet", type: "error" });
      return;
    }

    const contract = await getNFTContractSignature(library.getSigner());

    await requestFunction({
      func: async () => {
        const tx = await contract.mint(eventId, 1, "0x", {
          value: ethers.utils.parseEther(event.price.toString()),
        });
        setLoading(true);
        setAlert({ message: "Please wait", type: "info" });
        await tx.wait();
      },
      successMessage: () =>
        setAlert({
          message: `Ticket purchase successful`,
          type: "success",
        }),
      failMessage: () =>
        setAlert({ message: "Transaction failed", type: "error" }),
    });
    await checkClaimStatus();
  };

  const setPassword = async (hash) => {
    if (!account) {
      setAlert({ message: "Please connect to a wallet", type: "error" });
      return;
    }

    const contract = await getNFTContractSignature(library.getSigner());

    await requestFunction({
      func: async () => {
        const tx = await contract.setPassword(eventId, hash);
        setLoading(true);
        setAlert({ message: "Please wait", type: "info" });
        await tx.wait();
      },
      successMessage: () =>
        setAlert({
          message: `Password set`,
          type: "success",
        }),
      failMessage: () =>
        setAlert({ message: "Transaction failed", type: "error" }),
    });
    setLoading(false);
  };

  return { loading, event, totalSupply, isClaimed, claimTicket, setPassword };
};
