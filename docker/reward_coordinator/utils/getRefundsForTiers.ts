import { BigNumber } from "ethers"

const getTierRefunds = (bids: any) => {
  const tierBidAmount = bids[bids.length - 1].amount
  return bids.map((bid: any) => ({...bid, refundAmount: BigNumber.from(bid.amount).sub(tierBidAmount)}))
}
const getRefundsForTiers = (tierCounts: number[], bids: any) => {
  const sortedBids = bids.sort((a: any, b: any) => BigNumber.from(a.amount).lt(b.amunt))
  const tieredBids = tierCounts.reduce((acc: any, tierCount: number, index: number) => {
    const startIndex = tierCounts.slice(0, index).reduce((acc: number, tierCount: number) => acc + tierCount, 0) 
    
    acc.push(sortedBids.slice(startIndex, startIndex + tierCount))
    return acc
  }, [])

  const totalTierCount = tierCounts.reduce((acc: number, tierCount: number) => acc + tierCount, 0)
  tieredBids.push(sortedBids.slice(totalTierCount)) 

  return tieredBids.map(getTierRefunds)
}

export default getRefundsForTiers