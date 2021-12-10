import getPublicKey from "../utils/getPublicKey"
import { lithiumPricing } from "../contractInstances/lithiumPricing"
import USER_PUBLIC_KEYS from "../storage/userPublicKeys";

const fetchPublicKeyFromAddress = async (userAddress:string)=>{
  const address = userAddress.replace(/\s+/g, '');

  const eventFilter = lithiumPricing.filters.BidReceived(null,address)
  const events = await lithiumPricing.queryFilter(eventFilter)

  if(events.length === 0){
    throw new Error(`No bid transactions found for ${address}`)
  }

  const publicKey = await getPublicKey(events[0].transactionHash);
  
  return publicKey;
}

const getPublicKeyFromAddress = async (address:string) => {
  if(USER_PUBLIC_KEYS.keyIsStored(address)) {
    return USER_PUBLIC_KEYS.getPublicKey(address)
  } else {
    const publicKey = await fetchPublicKeyFromAddress(address)
    USER_PUBLIC_KEYS.setPublicKey(address, publicKey.slice(2))
    return publicKey
  }
}

export default getPublicKeyFromAddress