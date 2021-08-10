const config = {
  contractAddress: require("./config.json"), //the json containing the smart contract Lithium addresses
  privateKey: process.env["DEVNET_PRIVKEY"],
  abiPricing: require("../abis/LithiumPricing.json"),
  host: "http://127.0.0.1:8545",
};
export default config;
