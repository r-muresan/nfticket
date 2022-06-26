const { ethers } = require("hardhat");

// TO DEPLOY + VERIFY:
// npx hardhat run hardhat/deployGov.js --network polygon
// npx hardhat clean
// npx hardhat verify --constructor-args "0xd979DBd0bDC32B1aE0524E88c959DE4dFCaeef08" DEPLOYED_ADDRESS
//npx hardhat verify --network polygon GOV "NFT"

async function main() {
  const Governance = await ethers.getContractFactory("Governance");
  let contract = await Governance.deploy("");
  console.log(contract);
  await contract.deployed();
  console.log(contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
