const { ethers } = require("hardhat");

// TO DEPLOY + VERIFY:
// npx hardhat run hardhat/deploy.js --network polygon
// npx hardhat clean
// npx hardhat verify addr --network polygon

async function main() {
  const NFTicket1155 = await ethers.getContractFactory("Governance");
  let contract = await Governance.deploy();
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