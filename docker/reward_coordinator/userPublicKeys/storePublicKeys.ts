import USER_PUBLIC_KEYS from "../storage/userPublicKeys"
import getPublicKeyFromAddress from "./getPublicKeyFromAddress"

const getAndStorePublicKey = async (address: string): Promise<void> => {
  const publicKey = await getPublicKeyFromAddress(address)
  if (publicKey != null) {
    USER_PUBLIC_KEYS.setPublicKey(address, publicKey.slice(2))
  } else {
    console.log(`Error getting public key for address$ ${address}`)
  }
}

const storeKeysForAddresses = (addresses: string[]): void => {
  addresses.forEach((address) => {
    if (USER_PUBLIC_KEYS.keyIsStored(address)) {
      return
    } else {
      getAndStorePublicKey(address)
    }
  })
}

const storePublicKeys = (question: any): void => {
  const addresses = question.bids.map((bid: any) => bid.user.id)
  storeKeysForAddresses(addresses)
}

export default storePublicKeys