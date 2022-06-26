import { fromUnixTime } from "date-fns";
import { ethers } from "ethers";

import NFTicket1155 from "/hardhat/contractArtifacts/hardhat/contracts/NFTicket1155.sol/NFTicket1155.json";
import Governance from "/hardhat/contractArtifacts/hardhat/contracts/Governance.sol/Governance.json";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const formatAddress = (address) => {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 6)
  );
};

export const getENS = async (address) => {
  const provider = new ethers.providers.getDefaultProvider();
  const ens = await provider.lookupAddress(address);
  return ens;
};

export const getNFTContract = () => {
  const provider = new ethers.providers.getDefaultProvider(
    process.env.NEXT_PUBLIC_NETWORK_URL
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT,
    NFTicket1155.abi,
    provider
  );
  return contract;
};

export const getGovernanceContract = () => {
  const provider = new ethers.providers.getDefaultProvider(
    process.env.NEXT_PUBLIC_NETWORK_URL
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT,
    Governance.abi,
    provider
  );
  return contract;
};

export const getNFTContractSignature = async (signer) => {
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT,
    NFTicket1155.abi,
    signer
  );

  return contract;
};

export const getGovernanceContractSignature = async (signer) => {
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_GOVERNANCE_CONTRACT,
    Governance.abi,
    signer
  );

  return contract;
};

export const requestFunction = async ({
  func,
  callback,
  successMessage,
  failMessage,
}) => {
  try {
    const val = await func();
    callback?.(val);
    successMessage?.();
  } catch (err) {
    console.log(err);
    failMessage?.();
  }
};

export const parseEvent = (event) => {
  return {
    id: parseInt(event.id),
    eventDate: fromUnixTime(parseInt(event.eventDate)),
    name: event.name,
    description: event.description,
    location: event.location,
    image: event.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/"),
    whitelisted: event.whitelisted,
    maxParticipants: parseInt(event.supply),
    hasWhitelist: event.hasWhitelist,
    price: parseInt(event.price),
    link: event.link,
    host: event.host,
  };
};

export const parseProposal = (proposal) => {
  return {
    id: parseInt(proposal.id),
    proposing: proposal.proposing,
    options: proposal.options,
    voteDelay: parseInt(proposal.voteDelay),
    creationTime: parseInt(proposal.creationTime),
    vote: proposal.votes,
  };
};
