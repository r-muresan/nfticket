const { ethers } = require("hardhat");

// TO DEPLOY + VERIFY:
// npx hardhat run hardhat/deployBuild.js --network polygon
// npx hardhat clean
// npx hardhat verify addr --network polygon

async function main() {
  const Events = await ethers.getContractFactory("Events");
  let contract = await Events.deploy(process.env.NEXT_PUBLIC_BLOCK_FACTORY);
  await contract.deployed();
  console.log(contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
