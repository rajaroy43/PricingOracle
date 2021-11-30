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
  let answers = await Promise.all(bidders.map(async(bidder)=>({'address':bidder.address,'value': await encryptValue(bidder.publicKey, answerValue)})))
  // @ts-ignore
  answers = answers.reduce((acc, bid) => {{ acc[bid.address] = bid.value}; return acc}, {})
  return {
    questionId,
    answers
  }
}

export default getEncryptedAnswers