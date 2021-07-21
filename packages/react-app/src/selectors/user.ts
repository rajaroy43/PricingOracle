import { User } from "lithium-subgraph"
import { formatUnits } from "../helpers/formatters"
import { UserView } from "../types/user"
import { selectAnswer } from "./answer"
import { selectQuestion } from "./question"

export const selectUser = (user: User): UserView => {
  const tokenApprovalBalanceDisplay = formatUnits(user.tokenApprovalBalance)
  return {
    ...user,
    totalBountyDisplay: formatUnits(user.totalBounty),
    totalRewardsClaimedDisplay: formatUnits(user.totalRewardsClaimed),
    totalStakedDisplay: formatUnits(user.totalStaked),
    tokenBalanceDisplay: formatUnits(user.tokenBalance),
    tokenApprovalBalanceDisplay,
    pricingIsApproved: +tokenApprovalBalanceDisplay > 0,
    // @ts-ignore
    questionViews: user.questions ? user.questions.map(selectQuestion) : null,
    // @ts-ignore
    answerViews: user.answers ? user.answers.map(selectAnswer) : null
  }
}