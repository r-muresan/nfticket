const { ethers } = require("hardhat");

// TO DEPLOY + VERIFY:
// npx hardhat run hardhat/deployGov.js --network polygon
// npx hardhat clean
// npx hardhat verify addr --network polygon

async function main() {
  const Governance = await ethers.getContractFactory("Governance");
  let contract = await Governance.deploy("0x547ecb2c8e7e590cdd731a762894e3135d8C896d");
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