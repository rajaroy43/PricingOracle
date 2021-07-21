import { User } from 'lithium-subgraph'
import { AnswerView } from './answer';
import { QuestionView } from './question';

export interface UserView extends User {
  totalBountyDisplay: string
  totalRewardsClaimedDisplay: string
  totalStakedDisplay: string
  tokenBalanceDisplay: string
  tokenApprovalBalanceDisplay: string
  pricingIsApproved: boolean
  questionViews: QuestionView[]
  answerViews: AnswerView[]
}
