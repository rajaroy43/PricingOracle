import { AnswerGroup } from 'lithium-subgraph'
import { AnswerView } from './answer';
import { QuestionGroupView } from './questionGroup';


export interface AnswerGroupView extends AnswerGroup {
  totalStake: string
  totalStakeDisplay: string
  rewardAmountDisplay: string
  earnings: string
  earningsDisplay: string
  answerViews: AnswerView[]
  questionGroupView: QuestionGroupView
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