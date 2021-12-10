import { User } from "lithium-subgraph"
import { formatNumber, formatUnits } from "../helpers/formatters"
import { UserView } from "../types/user"
import { selectAnswerGroups } from "./answerGroup"
import { selectQuestion } from "./question"

export const selectUser = (user: User): UserView => {
  const tokenApprovalBalanceDisplay = formatUnits(user.tokenApprovalBalance)
  return {
    ...user,
    totalBountyDisplay: formatNumber(formatUnits(user.totalBounty)),
    totalRewardsClaimedDisplay: formatNumber(formatUnits(user.totalRewardsClaimed)),
    totalStakedDisplay: formatNumber(formatUnits(user.totalStaked)),
    tokenBalanceDisplay: formatNumber(formatUnits(user.tokenBalance)),
    tokenApprovalBalanceDisplay,
    pricingIsApproved: +tokenApprovalBalanceDisplay > 0,
    // @ts-ignore
    questionViews: user.questions ? user.questions.map(selectQuestion) : null,
    // @ts-ignore
    answerGroupsView: user.answerGroups ? selectAnswerGroups(user.answerGroups) : null
  }
}