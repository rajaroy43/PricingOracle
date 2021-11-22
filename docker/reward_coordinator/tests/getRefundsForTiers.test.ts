
const testData = [
  {
    id: '0x1234-0',
    isRefunded: false,
    amount: '123000000000000000000'
  },
  {
    id: '0x2234-0',
    isRefunded: false,
    amount: '125400000000000000000'
  },
  {
    id: '0x3234-0',
    isRefunded: false,
    amount: '2123000000000000000000'
  },
  {
    id: '0x4234-0',
    isRefunded: false,
    amount: '1123000000000000000000'
  },
  {
    id: '0x5234-0',
    isRefunded: false,
    amount: '165000000000000000000'
  },
  {
    id: '0x6234-0',
    isRefunded: false,
    amount: '123450000000000000000'
  },
  {
    id: '0x7234-0',
    isRefunded: false,
    amount: '323000000000000000000'
  },
  {
    id: '0x8234-0',
    isRefunded: false,
    amount: '2623000000000000000000'
  },
  {
    id: '0x221234-0',
    isRefunded: false,
    amount: '5123000000000000000000'
  },
  {
    id: '0x122234-0',
    isRefunded: false,
    amount: '3123000000000000000000'
  },
  {
    id: '0x123422-0',
    isRefunded: false,
    amount: '8323000000000000000000'
  },
  {
    id: '0x22541234-0',
    isRefunded: false,
    amount: '59763000000000000000000'
  },
  {
    id: '0x64565-0',
    isRefunded: false,
    amount: '3943000000000000000000'
  },
  {
    id: '0x123754422-0',
    isRefunded: false,
    amount: '83673000000000000000000'
  }
]

describe("Can calculate refund amounts for tiers", () => {
  it("Can calculate refunds for 3 tiers ", () => {
    const tierCounts = [2,4]
    const refundAmo
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
})