import { User } from 'lithium-subgraph'

export interface UserView extends User {
  totalBountyDisplay: string
  totalRewardsClaimedDisplay: string
  totalStakedDisplay: string
  tokenBalanceDisplay: string
  tokenApprovalBalanceDisplay: string
}
