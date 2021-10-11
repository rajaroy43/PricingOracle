import { BigNumber } from "ethers"
import { AnswerGroup } from "lithium-subgraph"
import { formatUnits } from "../helpers/formatters"
import { AnswerGroupView, AnswerGroupsView } from "../types/answerGroup"
import { selectAnswer } from "./answer"

export const selectAnswerGroup = (answerGroup: AnswerGroup): AnswerGroupView => {
  return {
    ...answerGroup,
    rewardAmountDisplay: formatUnits(answerGroup.rewardAmount),
    answerViews: answerGroup.answers.map(selectAnswer)
  }
}

export const selectAnswerGroups = (answerGroups: AnswerGroup[]): AnswerGroupsView => {
  const groupsAcc = {
    pendingAnswerGroups: [],
    unclaimedAnswerGroups: [],
    unclaimedRewards: BigNumber.from(0)
  }

  const filteredGroups = answerGroups.reduce((acc: any, answerGroup: AnswerGroup) => {
    if (answerGroup.isRewardCalculated === 'NotCalculated'){//StatusCalculated.NotCalculated) {
      acc.pendingAnswerGroups.push(answerGroup)
    } else {
      acc.unclaimedAnswerGroups.push(answerGroup)
      acc.unclaimedRewards = acc.unclaimedRewards.add(answerGroup.rewardAmount)
    }
    return acc
  }, groupsAcc)

  const unclaimedRewardsDisplay = formatUnits(filteredGroups.unclaimedRewards.toString())
  return {
    ...filteredGroups,
    unclaimedRewards: filteredGroups.unclaimedRewards.toString(),
    unclaimedRewardsDisplay,
    hasUnclaimedRewards: filteredGroups.unclaimedRewards.gt(0),
    claimableIds: filteredGroups.unclaimedAnswerGroups.map((group: AnswerGroup) => group.questionGroup.id),
    answerGroupViews: answerGroups.map(selectAnswerGroup)
  }
}