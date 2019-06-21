const HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic ="candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/a5a7743945484d33b96fe530303b0186")
      },
      network_id: "4",
      gas: 4500000,
      gasPrice: 10000000000
    },                                  
    compilers: {
      solc: {
        version: "^0.4.24",
        docker : false,
      }
    }
  }
};
