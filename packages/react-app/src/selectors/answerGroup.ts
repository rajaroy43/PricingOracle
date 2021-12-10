import { BigNumber } from "ethers"
import { AnswerGroup } from "lithium-subgraph"
import { formatNumber, formatUnits } from "../helpers/formatters"
import { AnswerGroupView, AnswerGroupsView } from "../types/answerGroup"
import { selectAnswer } from "./answer"
import { selectQuestionGroup } from "./questionGroup"

export const selectAnswerGroup = (answerGroup: AnswerGroup): AnswerGroupView => {
  const totalStake = answerGroup.answers.reduce((acc, answer) => {
    return acc.add(answer.stakeAmount)
  }, BigNumber.from(0))
  const earnings = BigNumber.from(answerGroup.rewardAmount).sub(totalStake)
  return {
    ...answerGroup,
    rewardAmountDisplay: formatUnits(answerGroup.rewardAmount),
    answerViews: answerGroup.answers.map(selectAnswer),
    totalStake: totalStake.toString(),
    totalStakeDisplay: formatUnits(totalStake.toString()),
    earnings: earnings.toString(),
    earningsDisplay: formatUnits(earnings.toString()),
    questionGroupView: selectQuestionGroup(answerGroup.questionGroup)
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

  const unclaimedRewardsDisplay = formatNumber(formatUnits(filteredGroups.unclaimedRewards.toString()))
  return {
    ...filteredGroups,
    unclaimedRewards: filteredGroups.unclaimedRewards.toString(),
    unclaimedRewardsDisplay,
    hasUnclaimedRewards: filteredGroups.unclaimedRewards.gt(0),
    claimableIds: filteredGroups.unclaimedAnswerGroups.map((group: AnswerGroup) => group.questionGroup.id),
    answerGroupViews: answerGroups.map(selectAnswerGroup)
  }
}