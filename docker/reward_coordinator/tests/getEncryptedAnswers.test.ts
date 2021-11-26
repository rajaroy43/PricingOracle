import getEncryptedAnswers from '../utils/getEncryptedAnswers';
import EthCrypto from 'eth-crypto'
import { Bidder } from '../types'

  describe("Answers encryption with public key", () => {
    const questionId = 1;
    const answerValue = '100';

    const createMockdata = (numberofUsers:number)=>{
      let mockdata =[];
      mockdata = Array(numberofUsers).fill(0).map(()=>{
        const user = EthCrypto.createIdentity()
        return {
        publickey:user.publicKey,
        bidder:user.address,
        privatekey:user.privateKey
      }})

      return mockdata;
    }

    const getUserData =(testData:any): Bidder[]=> {
      var bidders:Bidder[]=[];
      bidders= testData.map((test:any)=>{
        return {
          publicKey :test.publickey,
          address :test.bidder
        }
      })
      return bidders
    }

    const decryptdata = async(encryptedString:string,privateKey:string) =>{
      const encryptedObject = EthCrypto.cipher.parse(encryptedString);
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        encryptedObject
      );
      return decrypted;
    }

    const getCorrectEncryption = async(numberOfUsers:number)=>{
      const testData = createMockdata(numberOfUsers)
      const bidders = getUserData(testData)
      const encryptedAnswers = await getEncryptedAnswers(questionId,bidders,answerValue)
      testData.forEach(async(data)=>{
        // @ts-ignore
        const decryptedAnswerValue = await decryptdata(encryptedAnswers.answers[data.bidder],data.privatekey);
        expect(decryptedAnswerValue).toBe(answerValue)
      })
    }

    it("Should calculate correct encryption/decryption ",async ()=>{
      //random number of user
      const numberOfUsers = [10,8,3];
      numberOfUsers.forEach(numberOfUser=>getCorrectEncryption(numberOfUser))
    })

    it("Should not calculate correct encryption/decryption for invalid private  keys ",async ()=>{
      const numberOfUsers = 1;
      var testData = createMockdata(numberOfUsers)
      const bidders = getUserData(testData)
      testData[0].privatekey = "random data"; 
      const encryptedAnswers =await getEncryptedAnswers(questionId,bidders,answerValue)
      testData.forEach(async(data)=>{
        // @ts-ignore
        await expect(decryptdata(encryptedAnswers.answers[data.bidder],data.privatekey)).rejects.toThrowError("Bad private key")
      })
    })

    it("Should not calculate correct encryption/decryption for invalid public  key length",async ()=>{
      const numberOfUsers = 1;
      var testData = createMockdata(numberOfUsers)
      const bidders = getUserData(testData)
      bidders[0].publicKey = "random data";  
      await expect(getEncryptedAnswers(questionId,bidders,answerValue)).rejects.toThrowError("Expected public key to be an Uint8Array with length [33, 65]")
    })
    
  });


