import getEncryptedAnswers from '../utils/getEncryptedAnswers';
import EthCrypto from 'eth-crypto'

  describe("Answers encryption with public key", () => {

    const createMockdata = (numberofUsers:number)=>{
      let mockdata =[];
      for(let i=0; i<numberofUsers;i++){
        const user = EthCrypto.createIdentity()
        const formattedData = {
          publickey:user.publicKey,
          bidder:user.address,
          privatekey:user.privateKey,
          answerValue:Math.floor(Math.random() * numberofUsers)
        }
        mockdata.push(formattedData);
      }

      return mockdata;
    }

    const getUserData =(testData:any)=>{
      let publicKeys=[],bidders=[],answerValues=[];
      for(let i=0;i<testData.length;i++){
        publicKeys.push(testData[i].publickey);
        bidders.push(testData[i].bidder);
        answerValues.push(testData[i].answerValue);
      }
      //console.log(publicKeys.reduce,bidders,answerValues)
      return {publicKeys,bidders,answerValues}
    }

    const decryptdata = async(encryptedString:string,privateKey:string) =>{
      const encryptedObject = EthCrypto.cipher.parse(encryptedString);
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        encryptedObject
      );
      return JSON.parse(decrypted);
    }

    const getCorrectEncryption = async(numberOfUsers:number)=>{
      const testData = createMockdata(numberOfUsers)
      const encryptionData = getUserData(testData)
      const encryptedAnswers =await getEncryptedAnswers(encryptionData.publicKeys,encryptionData.bidders,encryptionData.answerValues)
      testData.forEach(async(data)=>{
        const decryptedAnswers = await decryptdata(encryptedAnswers[data.bidder],data.privatekey);
        expect(data.bidder).toBe(decryptedAnswers.bidder)
        expect(data.answerValue).toBe(decryptedAnswers.answerValue)
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
      var encryptionData = getUserData(testData)
      testData[0].privatekey = "random data"; 
      const encryptedAnswers =await getEncryptedAnswers(encryptionData.publicKeys,encryptionData.bidders,encryptionData.answerValues)
      testData.forEach(async(data)=>{
        await expect(decryptdata(encryptedAnswers[data.bidder],data.privatekey)).rejects.toThrowError("Bad private key")
      })
    })

    it("Should not calculate correct encryption/decryption for invalid public  key length",async ()=>{
      const numberOfUsers = 1;
      var testData = createMockdata(numberOfUsers)
      var encryptionData = getUserData(testData)
      encryptionData.publicKeys[0] = "random data";  
      await expect(getEncryptedAnswers(encryptionData.publicKeys,encryptionData.bidders,encryptionData.answerValues)).rejects.toThrowError("Expected public key to be an Uint8Array with length [33, 65]")
    
    })
    
  });


