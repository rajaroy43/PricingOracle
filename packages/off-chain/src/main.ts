import web3 from "web3";
import Cordinator from "./lib/Cordinator";
import config from "../config/configData";
// Configurations
//Will use Bot for announcing question to the wisdom-node-group
import TelegramBot from "./lib/Chatbots";
if (!config.contractAddress) {
  console.error("contract address are required");
  process.exit();
}
let chatBot: TelegramBot | null;
if (
  config.telegramBot &&
  config.telegramBot.token &&
  config.telegramBot.groupId
) {
  chatBot = new TelegramBot(
    config.telegramBot.token,
    config.telegramBot.groupId,
    config.telegramBot.instanceId
  );
} else {
  chatBot = null;
}
const cordinator = new Cordinator(config, web3, chatBot);
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
