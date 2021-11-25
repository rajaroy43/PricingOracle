import EthCrypto from 'eth-crypto'
import { Bidder } from '../types';

const encryptValue = async(publicKey:string,value:string)  =>{

    const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey, // by encryping with user publicKey, only user can decrypt the payload with his privateKey
        JSON.stringify(value) // we have to stringify the payload before we can encrypt it
    );

    const encryptedString = EthCrypto.cipher.stringify(encrypted);

    return encryptedString;

}

const getEncryptedAnswers = async(questionId: number,bidders:Bidder[],answerValue:string)=>{

    const answers = bidders.reduce((acc: any, bidder: Bidder) => {
      acc[bidder.address] = encryptValue(bidder.publicKey, answerValue)
      return acc
    }, {})
    return {
      questionId,
      answers
    }
}

export default getEncryptedAnswers