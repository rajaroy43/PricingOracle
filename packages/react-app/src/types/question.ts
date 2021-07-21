import { Question } from 'lithium-subgraph'

export interface QuestionView extends Question {
  answerSetTotalsDisplay: string[]
  bountyDisplay: string
  totalStakedDisplay: string
  endTimeLocal: string
  topAnswerIndex: number
  topAnswerValue: string
  topAnswerDisplay: string
  isFinished: boolean
  createdLocal: string
}
