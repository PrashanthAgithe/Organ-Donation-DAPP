require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-gas-reporter");
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", //Ganache's RPC server address
      accounts: {
        mnemonic: process.env.MNEMONIC, //mnemonic displayed in Ganache so that hardhat will automatically extract multiple accounts 
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: "", // optional
    outputFile: "gas-report.txt",
    noColors: true,
  },
};
