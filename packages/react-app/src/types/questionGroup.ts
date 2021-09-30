import { QuestionGroup } from 'lithium-subgraph'
import { QuestionView } from './question';

export interface QuestionGroupView extends QuestionGroup {
  endTimeLocal: string
  startTimeLocal: string
  isFinished: boolean
  totalBounty: string
  totalBountyDisplay: string
  questionViews: QuestionView[]
}