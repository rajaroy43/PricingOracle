const EthUtil = require('ethereumjs-util')
import  Common from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
//This is the mock  transaction data
import mockTransactionData from './mockTransactionData.json'

describe("Public key extracttion from user address", () => {
    it("Calculated address must be equal to sender address", () => {
        for (let index=0 ; index<mockTransactionData.length ; index++){
          //@ts-ignore
          const transactionData= mockTransactionData[index]
          const customCommon = Common.custom(
            {
              chainId: mockTransactionData[index].chainId,
            },
            { 
              hardfork:'london'
            },
          );
        //@ts-ignore
        const tx = FeeMarketEIP1559Transaction.fromTxData(transactionData, { common: customCommon  })
        const userAddress = EthUtil.bufferToHex(tx.getSenderAddress())
        expect(transactionData.from.toLowerCase()).toBe(userAddress.toLowerCase())
        }
    });

    it("Different Signed tx from same address must have same public key", () => {

        const customCommon = Common.custom(
          {
            chainId: mockTransactionData[0].chainId,
          },
          { 
            hardfork:'london'
          },
        );
      // 0 and 4 must have same public key (They are signed from same tx)
      const firstTxData = mockTransactionData[0];
      const fourthTxData = mockTransactionData[4];
      //@ts-ignore
      const tx1 = FeeMarketEIP1559Transaction.fromTxData(firstTxData, { common: customCommon  })
      //@ts-ignore
      const tx2 = FeeMarketEIP1559Transaction.fromTxData(fourthTxData, { common: customCommon  })
      const userAddressSIgnedTx1 = EthUtil.bufferToHex(tx1.getSenderAddress())
      const userAddressSIgnedTx2 = EthUtil.bufferToHex(tx2.getSenderAddress())
      const userPublickeySIgnedTx1 = EthUtil.bufferToHex(tx1.getSenderPublicKey())
      const userPublickeySIgnedTx12 = EthUtil.bufferToHex(tx2.getSenderPublicKey())
      expect(firstTxData.from.toLowerCase()).toBe(userAddressSIgnedTx1.toLowerCase())
      expect(fourthTxData.from.toLowerCase()).toBe(userAddressSIgnedTx2.toLowerCase())
      expect(userAddressSIgnedTx1).toBe(userAddressSIgnedTx2)
      expect(userPublickeySIgnedTx1).toBe(userPublickeySIgnedTx12);
  });

  it("should not calculate correct address if chainId is differ", () => {

    const customCommon = Common.custom(
      {
        //Adding random number here 
        chainId: mockTransactionData[0].chainId+12,
      },
      { 
        hardfork:'london'
      },
    );

    const transactionData = mockTransactionData[0];

    //@ts-ignore
    expect(()=>FeeMarketEIP1559Transaction.fromTxData(transactionData, { common: customCommon  })).toThrow("The chain ID does not match the chain ID of Common ")
  });

  it("should not calculate correct address if unknown hardFork property  is used", () => {

    expect(()=>Common.custom(
      {
        //Adding random number here 
        chainId: mockTransactionData[0].chainId+12,
      },
      { 
        hardfork:'unknown hardfork'
      },
    )).toThrow("Hardfork with name unknown hardfork not supported")

  });

  it("should not calculate public key if we change in signature property `v` ", () => {

    const customCommon = Common.custom(
      {
        //Adding random number here 
        chainId: mockTransactionData[0].chainId,
      },
      { 
        hardfork:'london'
      },
    );

    const transactionData = mockTransactionData[0];
    transactionData.v = transactionData.v+"12"
    //@ts-ignore
    expect(()=>FeeMarketEIP1559Transaction.fromTxData(transactionData, { common: customCommon  })).toThrow("The y-parity of the transaction should either be 0 or 1 ")
  });

  it("should not calculate public key if we change in signature property `r` ", () => {

    const customCommon = Common.custom(
      {
        //Adding random number here 
        chainId: mockTransactionData[0].chainId,
      },
      { 
        hardfork:'london'
      },
    );

    const transactionData = mockTransactionData[0];
    transactionData.r = transactionData.r+"12"
    //@ts-ignore
    expect(()=>FeeMarketEIP1559Transaction.fromTxData(transactionData, { common: customCommon  })).toThrow("r cannot exceed MAX_INTEGER")
  });
  it("should not calculate public key if we change in signature property `s` ", () => {

    const customCommon = Common.custom(
      {
        //Adding random number here 
        chainId: mockTransactionData[0].chainId,
      },
      { 
        hardfork:'london'
      },
    );

    const transactionData = mockTransactionData[0];
    transactionData.s = transactionData.s+"12"
    //@ts-ignore
    expect(()=>FeeMarketEIP1559Transaction.fromTxData(transactionData, { common: customCommon  })).toThrow("r cannot exceed MAX_INTEGER")
  });

  it("should not calculate public key if we change in transaction type ", () => {

    const customCommon = Common.custom(
      {
        //Adding random number here 
        chainId: mockTransactionData[0].chainId,
      },
      { 
        hardfork:'london'
      },
    );

    const transactionData = mockTransactionData[0];
    transactionData.type = transactionData.type+"12"
  
    //@ts-ignore
    expect(()=>FeeMarketEIP1559Transaction.fromTxData(transactionData, { common: customCommon  })).toThrow("r cannot exceed MAX_INTEGER")
  });
  

})