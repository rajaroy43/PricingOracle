const config = {
  fromBlock: 1,
  contractAddress: require("./config.json"), //the json containing the smart contract Lithium addresses
  //confirmations: 0, // Number of blocks before processing it, if working with ganache set as 0
  //now we have confirmation table ,so we don't use confirmations
  privateKey: process.env["DEVNET_PRIVKEY"],
  abiPricing: require("../abis/LithiumPricing.json"),
  storagePath: "./db",
  host: "http://127.0.0.1:8545",
  telegramBot: {
    token: "",
    groupId: 12,
    instanceId: "",
  },
};
export default config;
