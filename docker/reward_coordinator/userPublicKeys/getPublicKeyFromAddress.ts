import getPublicKey from "../utils/getPublicKey"
import { lithiumPricing } from "../contractInstances/lithiumPricing"
import { getTransactionCount } from "../queries/ethNode"
import USER_PUBLIC_KEYS from "../storage/userPublicKeys";

const fetchPublicKeyFromAddress = async (userAddress:string)=>{
  const address = userAddress.replace(/\s+/g, '');
  const getTxCount = await getTransactionCount(address);
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

const getPublicKeyFromAddress = async (address:string) => {
  if(USER_PUBLIC_KEYS.keyIsStored(address)) {
    return USER_PUBLIC_KEYS.getPublicKey(address)
  } else {
    const publicKey = await fetchPublicKeyFromAddress(address)
    USER_PUBLIC_KEYS.setPublicKey(address, publicKey)
    return publicKey
  }
}

export default getPublicKeyFromAddress