import { User } from 'lithium-subgraph'
import { AnswerGroupsView } from './answerGroup';
import { QuestionView } from './question';

export interface UserView extends User {
  totalBountyDisplay: string
  totalRewardsClaimedDisplay: string
  totalStakedDisplay: string
  tokenBalanceDisplay: string
  tokenApprovalBalanceDisplay: string
  pricingIsApproved: boolean
  questionViews: QuestionView[]
  answerGroupsView: AnswerGroupsView
}
