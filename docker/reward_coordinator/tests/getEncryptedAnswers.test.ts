import { getEncryptedAnswerDocument } from '../utils/encryptedAnswers';
import EthCrypto from 'eth-crypto'
import { Bidder } from '../types'

  describe("Answers encryption with public key", () => {
    const questionId = 1;
    const answerValue = '100';

    const createMockdata = (numberofUsers:number)=>{
      return Array(numberofUsers).fill(0).map(()=>{
        const user = EthCrypto.createIdentity()
        return {
          publickey:user.publicKey,
          bidder:user.address,
          privateKey:user.privateKey
        }
      })
    }

    const getUserData =(testData:any): Bidder[]=> {
      return  testData.map((test:any)=>{
        return {
          publicKey: test.publickey,
          address: test.bidder
        }
      })
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
      const encryptedAnswers = await getEncryptedAnswerDocument(questionId,bidders,answerValue)
      testData.forEach(async(data)=>{
        // @ts-ignore
        const decryptedAnswerValue = await decryptdata(encryptedAnswers.answers[data.bidder],data.privateKey);
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
      const testData = createMockdata(numberOfUsers)
      const bidders = getUserData(testData)
      testData[0].privateKey = "random data"; 
      const encryptedAnswers = await getEncryptedAnswerDocument(questionId,bidders,answerValue)
      testData.forEach(async(data)=>{
        // @ts-ignore
        await expect(decryptdata(encryptedAnswers.answers[data.bidder],data.privateKey)).rejects.toThrowError("Bad private key")
      })
    })

    it("Should not calculate correct encryption/decryption for invalid public  key length",async ()=>{
      const numberOfUsers = 1;
      const testData = createMockdata(numberOfUsers)
      const bidders = getUserData(testData)
      bidders[0].publicKey = "random data";  
      await expect(getEncryptedAnswerDocument(questionId,bidders,answerValue)).rejects.toThrowError("Expected public key to be an Uint8Array with length [33, 65]")
    })
    
  });


