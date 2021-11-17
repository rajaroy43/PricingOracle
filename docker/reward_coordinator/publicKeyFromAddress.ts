import getPublicKey from "./utils/getPublicKey"
import { lithiumPricing } from "./contractInstances/lithiumPricing"
import { ethProvider } from "./client"

const publicKeyFromAddress = async (userAddress:string)=>{
  const address = userAddress.replace(/\s+/g, '');
  const getTxCount = await ethProvider.getTransactionCount(address)
  if(getTxCount == 0){
    throw new Error(`This user ${address} don't have any transaction yet`)
  }
  const eventFilter = lithiumPricing.filters.QuestionAnswered(null,address)
  const events = await lithiumPricing.queryFilter(eventFilter)
  const txHash = events[0]?.['transactionHash']
  if(!txHash){
    throw new Error(`This user ${address} doesn't answers any questions yet`)
  }
  const publicKey = await getPublicKey(txHash);
  
  return publicKey;
}


export default publicKeyFromAddress