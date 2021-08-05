import web3 from "web3";
import fs from "fs";
import TransactionSender from "./TransactionSender";
import TelegramBot from "../lib/Chatbots";
let chatBot: TelegramBot;
class Cordinator {
  web3: web3;
  config: any;
  transactionSender: TransactionSender;
  storagePath: string;
  lastBlockPath: string;
  lithiumPricingContract: any;
  constructor(config: any, Web3 = web3, _chatBot: TelegramBot | null) {
    this.config = config;
    this.web3 = new Web3(config.host);
    this.storagePath = config.storagePath;
    this.lastBlockPath = `${config.storagePath || __dirname}/lastBlock.txt`;
    this.lithiumPricingContract = new this.web3.eth.Contract(
      this.config.abiPricing,
      this.config.contractAddress.LithiumPricingAddress
    );
    this.transactionSender = new TransactionSender(this.web3, this.config);
    // this.chatBot = chatBot ;
  }
  //run Litium-Cordinator for getting question/answer and do some calculation
  async run() {
    console.info("Starting cordinator");
    let currentBlock = await this._getCurrentBlockNumber();
    const chainId = await this.web3.eth.getChainId();
    //Always ensure that getting 10 confirmations

    //If we are on local host then we igonore confirmation
    if (chainId != 1337) {
      currentBlock = currentBlock - 10;
    }

    console.info("Running to Block", currentBlock);
    if (currentBlock <= 0) return false;
    const fromBlock = this._getFromBlock(currentBlock);
    console.info("Running from Block", fromBlock);
    if (!fromBlock) return false;
    //will save block number in lastBlockPath after succesfull off-chain calculation
    await this._processBlocks(fromBlock, currentBlock);
  }
  async _getCurrentBlockNumber(): Promise<number> {
    return this.web3.eth.getBlockNumber();
  }

  _getFromBlock(toBlock: number): number | undefined {
    if (!fs.existsSync(this.config.storagePath)) {
      fs.mkdirSync(this.config.storagePath);
    }
    let originalFromBlock = this.config.fromBlock || 0;
    let fromBlock: number;
    try {
      fromBlock = parseInt(fs.readFileSync(this.lastBlockPath, "utf8"));
    } catch (err) {
      fromBlock = originalFromBlock;
    }
    if (fromBlock < originalFromBlock) {
      fromBlock = originalFromBlock;
    }
    if (fromBlock >= toBlock) {
      console.warn(
        `Current chain Height ${toBlock} is the same or lesser than the last block processed ${fromBlock}`
      );
      return undefined;
    }
    fromBlock = fromBlock + 1;

    return fromBlock;
  }

  async _processBlocks(fromBlock: number, toBlock: number) {
    const blocksPerPage = 1000;
    const numberOfPages = Math.ceil((toBlock - fromBlock) / blocksPerPage);
    console.log(
      `Total pages ${numberOfPages}, blocks per page ${blocksPerPage}`
    );
    let allLogsFromPagesConfirmed = true;
    let fromPageBlock = fromBlock;
    for (let currentPage = 1; currentPage <= numberOfPages; currentPage++) {
      let toPagedBlock = fromPageBlock + blocksPerPage - 1;
      if (currentPage === numberOfPages) {
        toPagedBlock = toBlock;
      }
      //Sheduler
      //polling process start here
      const logs = await this.lithiumPricingContract.getPastEvents(
        "QuestionCreated",
        {
          fromBlock: fromPageBlock,
          toBlock: toPagedBlock,
        }
      );
      if (!logs) throw new Error("Failed to obtain the logs");
      console.info(`Found ${logs.length} logs`);
      const lastBlockAllConfirmed = await this._processLogs(logs); // undefined meaning all blocks were confirmed
    }
  }
  async _processLogs(logs: any) {
    try {
      const transactionSender = new TransactionSender(this.web3, this.config);

      //const from = await transactionSender.getAddress(this.config.privateKey);
      let allLogsConfirmed = true;
      for (let log of logs) {
        console.info("Processing event log:", log);
        //Fetching Data from on-chain events
        const { takeonlQquestionIdHere, deadline } = log.returnValues;
        //2nd polling
      }
    } catch (err) {
      throw new Error(`Exception processing logs ${err}`);
    }
  }
}
export default Cordinator;
