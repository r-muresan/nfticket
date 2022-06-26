require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    polygon: {
      url: process.env.NEXT_PUBLIC_NETWORK_URL,
      accounts: [process.env.PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    cronos: {
      url: "https://evm-t3.cronos.org",
      accounts: [process.env.PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 5000 * 1e9,
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Expect to run 10000 times
      },
    },
  },
  paths: {
    sources: "./hardhat/contracts",
    tests: "./hardhat/test",
    cache: "./hardhat/cache",
    artifacts: "./hardhat/contractArtifacts",
  },
};
