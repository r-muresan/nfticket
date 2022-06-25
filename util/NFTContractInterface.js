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
  const { account, library } = useWeb3React();
  const { setAlert } = useAlert();

  useEffect(() => {
    if (eventId) {
      getEvent();
    }
  }, [eventId]);

  const getEvent = async () => {
    const contract = getNFTContract();

    await requestFunction({
      func: async () => {
        setLoading(true);
        const event = await contract.getEvent(eventId ?? 1);
        console.log(event);
        setEvent(parseEvent(event));
      },
      callback: () => setLoading(false),
      failMessage: () =>
        setAlert({ message: "Could not get event.", type: "error" }),
    });
  };

  return { loading, event };
};
