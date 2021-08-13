import web3 from "web3";
import TransactionSender from "./TransactionSender";
import QueryAnswerSets from './QueryAnswerSets'
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

    const Questions=await QueryAnswerSets();
    console.info(`Found ${Questions.size} questions for calculating rewards`);
    for await(var [questionId] of Questions) {
      const anserSetsIndex=Questions.get(questionId).map((res: { answerIndex: any; })=>res.answerIndex)
      console.info("Processing question id ", questionId);
      await this._processQuestions(questionId,anserSetsIndex);
    }
     
  
  }

   async _processQuestions(questionId: number,anserSetsIndex:number[]) {
     if (!anserSetsIndex.length){
       console.info(`Failed to obtain the AnswersIndex with question id ${questionId}`);
       return;
     }
    //Here it will call python service for getting rewards
    const iscalculate= await this._processQuestion(anserSetsIndex); // undefined meaning all blocks were confirmed
    if(iscalculate){
      //we will use TransactionSender here 
      //Do transaction on L1 with updating user reward and also update rewards calculation status
      console.log("Lithium Cordinator submit tx here ")
    }
  }
  async _processQuestion(question: number[]): Promise<boolean>{
    //Call to python service for getting rewards 
    //it will return true or false if python service return result
    return true;
}
}

export default Cordinator