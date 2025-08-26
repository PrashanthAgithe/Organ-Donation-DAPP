require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337, // default is 31337, but you can pick 1337 for compatibility
      accounts: {
        count: 20, // generates 20 accounts
      }
    }
  }
};
