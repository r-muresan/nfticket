const { ethers } = require("hardhat");

// TO DEPLOY + VERIFY:
// npx hardhat run hardhat/deployGov.js --network polygon
// npx hardhat clean
// npx hardhat verify --constructor-args argGov.js DEPLOYED_ADDRESS

async function main() {
  const Governance = await ethers.getContractFactory("Governance");
  let contract = await Governance.deploy(process.env.NEXT_PUBLIC_NFT_CONTRACT);
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
