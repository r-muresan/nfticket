const { ethers } = require("hardhat");
require("dotenv").config();

// TO TEST
// npx hardhat run hardhat/liveTest.js --network polygon

const contract_addr = process.env.CONTRACT_ADDRESS;
const addr = "0x5914610183E3cAE3CC678Ab3Baf268a04dE36ecF";

async function main() {
  const BlockFactory = await ethers.getContractFactory("BlockFactory");
  let contract = BlockFactory.attach(contract_addr);
  setURI(contract);
}

const getURI = async (contract) => {
  const uri = await contract.uri(1);
  console.log(uri);
};

const setURI = async (contract) => {
  await contract.setURI(
    "https://ipfs.io/ipfs/QmSAbZwmw5Sy39irk7UsQQEnte6t6p3LLzbu8uynMNaJcp/{id}.json"
  );
};

const contractURI = async (contract) => {
  console.log(await contract.contractURI());
};

const claimFunds = async (contract) => {
  console.log(await contract.claimFunds());
};

const getPurchaseState = async (contract) => {
  console.log(await contract.getPurchaseState(addr));
};

const buyBlocks = async (contract) => {
  console.log(await contract.buyBlocks(3));
};

const mintBlocks = async (contract) => {
  await contract.mintBlocks();
};

const isWaitingForMint = async (contract) => {
  console.log(await contract.isWaitingForMint(addr));
};

const getBlocksToMint = async (contract) => {
  const hasBlocks = await contract.getBlocksToMint(addr);
  console.log(hasBlocks);
};

const getOwnedBlocks = async (contract) => {
  let blocks = await contract.getOwnedBlocks(addr);
  console.log(blocks);
};

const tokenURI = async (contract) => {
  let data = await contract.tokenURI(4);
  console.log(data);
};

main();
