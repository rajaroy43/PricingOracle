import { BigNumber } from "ethers";
import getRefundsForTiers from "../utils/getRefundsForTiers";

const testData = [
  {
    id: '0x1234-0',
    isRefunded: false,
    amount: '123000000000000000'
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
    id: '0x921234-0',
    isRefunded: false,
    amount: '5123000000000000000000'
  },
  {
    id: '0x1022234-0',
    isRefunded: false,
    amount: '3123000000000000000000'
  },
  {
    id: '0x1123422-0',
    isRefunded: false,
    amount: '8323000000000000000000'
  },
  {
    id: '0x122541234-0',
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
  const allEqualStakes = (tier: any) => {
    const tierStakeAmount = BigNumber.from(tier[tier.length - 1].amount).toString()
    for(var i = 0; i < tier.length; i++) {
      const effectiveStake = BigNumber.from(tier[i].amount).sub(tier[i].refundAmount).toString()
      expect(effectiveStake).toBe(tierStakeAmount)
    }
  }
  it("Can calculate refunds for 3 tiers ", () => {
    const tierCounts = [2,4]
    const refundAmounts = getRefundsForTiers(tierCounts, testData)
    expect(refundAmounts.length).toBe(tierCounts.length + 1)
    refundAmounts.forEach(allEqualStakes)
  })

  it("Can calculate refunds for 3 tiers ", () => {
    const tierCounts = [2,3,5]
    const refundAmounts = getRefundsForTiers(tierCounts, testData)
    expect(refundAmounts.length).toBe(tierCounts.length + 1)
    refundAmounts.forEach(allEqualStakes)
  })

})