import { ethers } from "ethers";
import BlockFactory from "/hardhat/contractArtifacts/hardhat/contracts/NFTicket1155.sol/NFTicket1155.json";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const formatAddress = (address) => {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 6)
  );
};

export const getNFTContract = () => {
  let provider;
  if (window?.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.providers.getDefaultProvider(
      process.env.NEXT_PUBLIC_NETWORK_URL
    );
  }
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT,
    BlockFactory.abi,
    provider
  );
  return contract;
};

export const getNFTContractSignature = async (signer) => {
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT,
    BlockFactory.abi,
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
