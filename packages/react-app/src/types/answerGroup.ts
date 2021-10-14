import { AnswerGroup } from 'lithium-subgraph'
import { AnswerView } from './answer';

export interface AnswerGroupView extends AnswerGroup {
  rewardAmountDisplay: string
  answerViews: AnswerView[]
}

export interface AnswerGroupsView {
  pendingAnswerGroups: number
  unclaimedAnswerGroups: number
  unclaimedRewards: string
  unclaimedRewardsDisplay: string
  claimableIds: string[]
  hasUnclaimedRewards: boolean
  answerGroupViews: AnswerGroupView[]
}