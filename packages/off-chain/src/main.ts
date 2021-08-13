import web3 from "web3";
import Cordinator from "./lib/Cordinator";
import config from "../config/configData";
if (!config.contractAddress) {
  console.error("contract address are required");
  process.exit();
}
const cordinator = new Cordinator(config, web3);
console.log("Host url", config.host);
async function run() {
  try {
    await cordinator.run();
  } catch (err) {
    console.error("Unhandled Error on run()", err);
    process.exit();
  }
}
run();
async function exitHandler() {
  process.exit();
}

// catches ctrl+c event
process.on("SIGINT", exitHandler);
