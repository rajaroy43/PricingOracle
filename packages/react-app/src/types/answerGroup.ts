import { AnswerGroup } from 'lithium-subgraph'
import { AnswerView } from './answer';

export interface AnswerGroupView extends AnswerGroup {
  rewardAmountDisplay: string
  answerViews: AnswerView[]
}