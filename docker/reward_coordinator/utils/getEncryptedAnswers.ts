import EthCrypto from 'eth-crypto'

const getEncryptedAnswer = async(publicKey:string,bidder:string,answerValue:number)  =>{
    const payload = {
        bidder:bidder,
        answerValue: answerValue
    }

    const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey, // by encryping with user publicKey, only user can decrypt the payload with his privateKey
        JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
    );

    const encryptedString = EthCrypto.cipher.stringify(encrypted);

    return encryptedString;

}

const getEncryptedAnswers = async(publicKeys:string[],bidders:string[],answerValues:number[])=>{
    let userEncryptedAnswers:any ={};
    for(let i=0;i<bidders.length;i++){
      userEncryptedAnswers[bidders[i]] = await getEncryptedAnswer(publicKeys[i],bidders[i],answerValues[i])
    }

    return userEncryptedAnswers;
}

export default getEncryptedAnswers