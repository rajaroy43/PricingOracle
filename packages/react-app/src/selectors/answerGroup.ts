import { BigNumber } from "ethers"
import { AnswerGroup, AnswerStatus } from "lithium-subgraph"
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
    if (answerGroup.isRewardCalculated === 'NotCalculated') {
      acc.pendingAnswerGroups.push(answerGroup)
    } else {
      acc.unclaimedAnswerGroups.push(answerGroup)
      acc.unclaimedRewards.add(BigNumber.from(answerGroup.rewardAmount))
    }
    return acc
  }, groupsAcc)
  return {
    ...filteredGroups,
    unclaimedRewardsDisplay: formatUnits(filteredGroups.unclaimedRewards.toString()),
    answerGroupViews: answerGroups.map(selectAnswerGroup)
  }
}