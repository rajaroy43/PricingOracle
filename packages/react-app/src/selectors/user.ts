import { User } from "lithium-subgraph"
import { formatUnits } from "../helpers/formatters"
import { UserView } from "../types/user"

export const selectUser = (user: User): UserView => {
  return {
    ...user,
    totalBountyDisplay: formatUnits(user.totalBounty),
    totalRewardsClaimedDisplay: formatUnits(user.totalRewardsClaimed),
    totalStakedDisplay: formatUnits(user.totalStaked),
    tokenBalanceDisplay: formatUnits(user.tokenBalance),
    tokenApprovalBalanceDisplay: formatUnits(user.tokenApprovalBalance)
  }
}