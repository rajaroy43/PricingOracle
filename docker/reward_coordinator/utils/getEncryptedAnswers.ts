import EthCrypto from 'eth-crypto'
import { Bidder } from '../types';

const encryptValue = async(publicKey:string,value:string)  =>{

  const encrypted = await EthCrypto.encryptWithPublicKey(
    publicKey, // by encryping with user publicKey, only user can decrypt the payload with his privateKey
    value // value must be in string
  );

  const encryptedString = EthCrypto.cipher.stringify(encrypted);

  return encryptedString;

}

const getEncryptedAnswers = async(questionId: number,bidders:Bidder[],answerValue:string)=>{
    
  // @ts-ignore
    const answers = await bidders.reduce(async(acc: any, bidder: Bidder) => {
      const current = await acc; // unwrap the previous Promise
      current[bidder.address] = await encryptValue(bidder.publicKey, answerValue)
      return current
    }, {})
    return {
      questionId,
      answers
    }
}

export default getEncryptedAnswers