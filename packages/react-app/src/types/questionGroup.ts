import { QuestionGroup } from 'lithium-subgraph'
import { QuestionView } from './question';

export interface QuestionGroupView extends QuestionGroup {
  endTimeLocal: string
  startTimeLocal: string
  isFinished: boolean
  isStarted: boolean
  totalBounty: string
  totalBountyDisplay: string
  totalStake: string
  totalStakeDisplay: string
  totalPool: string
  totalPoolDisplay: string
  categoryId: string
  categoryLabel: string
  questionViews: QuestionView[]
}