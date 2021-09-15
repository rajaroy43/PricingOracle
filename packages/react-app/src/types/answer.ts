import { Answer } from 'lithium-subgraph'

export interface AnswerView extends Answer {
  answerValue: string
  stakeAmountDisplay: string
  createdLocal: string
}
