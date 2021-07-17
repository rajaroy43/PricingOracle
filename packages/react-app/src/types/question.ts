import { Question } from 'lithium-subgraph'

export interface QuestionView extends Question {
  answerSetTotalsDisplay: string[]
  bountyDisplay: string
  totalStakedDisplay: string
  endTimeLocal: string
  isFinished: boolean
  createdLocal: string
}