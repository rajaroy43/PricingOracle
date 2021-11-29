import { refundBids } from "./contractInstances/lithiumPricing"
import { RefundBidsFields } from './types' 

export const publishBidderRefunds = async(args: RefundBidsFields ): Promise<void> => {
  const refundTx = await refundBids(args)
  await refundTx.wait()
  console.log(`bidder refund tx ${refundTx}`)
}