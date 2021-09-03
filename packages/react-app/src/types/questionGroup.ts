import { QuestionGroup } from 'lithium-subgraph'
import { QuestionView } from './question';

export interface QuestionGroupView extends QuestionGroup {
  endTimeLocal: string
  isFinished: boolean
  questionViews: QuestionView[]
}