import { BigNumber } from "ethers"


const getBidTiers = (tierCounts: number[], bids: any) => {
  const sortedBids = bids.sort((a: any, b: any) => BigNumber.from(a.amount).lt(b.amount) ? 1 : -1)
  const tieredBids = tierCounts.reduce((acc: any, tierCount: number, index: number) => {
    const startIndex = tierCounts.slice(0, index).reduce((count: number, tierTotal: number) => count + tierTotal, 0) 
    
    acc.push(sortedBids.slice(startIndex, startIndex + tierCount))
    return acc
  }, [])

  const totalTierCount = tierCounts.reduce((acc: number, tierCount: number) => acc + tierCount, 0)
  // get all remaining bids
  tieredBids.push(sortedBids.slice(totalTierCount))
  const tierRanges = tieredBids.map((tier: any) => {
    if (tier.length) {
      return [
        tier[0].amount,
        tier[tier.length - 1].amount
      ]
    } else {
      return [
        '0',
        '0'
      ]
    }
  }) 
  return {
    tieredBids,
    tierRanges
  }
}

export default getBidTiers