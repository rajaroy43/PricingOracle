import web3 from "web3";
import TransactionSender from "./TransactionSender";
import { Question } from "lithium-subgraph";
class Cordinator {
  web3: web3;
  config: any;
  transactionSender: TransactionSender;
  lithiumPricingContract: any;
  constructor(config: any, Web3 = web3) {
    this.config = config;
    this.web3 = new Web3(config.host);
    this.lithiumPricingContract = new this.web3.eth.Contract(
      this.config.abiPricing,
      this.config.contractAddress.LithiumPricingAddress
    );
    this.transactionSender = new TransactionSender(this.web3, this.config);
  }
  //run Litium-Cordinator for getting question/answer and do some calculation
  async run() {
    console.info("Starting cordinator");
    //querydata come from subgraph (All question id with  deadline passed)
    const Questions: Question[] = [];
    await this._processQuestions(Questions);
  }

  async _processQuestions(Questions: Question[]) {
    if (!Questions.length)
      throw new Error("Failed to obtain the Questions/Answers");
    console.info(`Found ${Questions.length} questions`);
    //loop over here
    for (let question of Questions) {
      console.info("Processing question ", question);

      await this._processQuestion(question); // undefined meaning all blocks were confirmed
    }
  }
  async _processQuestion(question: Question) {
    try {
      const transactionSender = new TransactionSender(this.web3, this.config);

      //const from = await transactionSender.getAddress(this.config.privateKey);
    } catch (err: any) {
      throw new Error(`Exception processing logs ${err}`);
    }
  }
}
export default Cordinator;
