import { Question } from "lithium-subgraph"
import { formatUnits, formatDate } from "../helpers/formatters"
import { QuestionView } from "../types/question"

export const selectQuestion = (question: Question): QuestionView => {
  //TODO query a node to get the latest block time
  const now = new Date().getTime() / 1000
  const isFinished = question.endTime < now
  return {
    ...question,
    // @ts-ignore
    answerSetTotalsDisplay: question.answerSetTotals.map(formatUnits),
    bountyDisplay: formatUnits(question.bounty),
    totalStakedDisplay: formatUnits(question.totalStaked),
    endTimeLocal: formatDate(question.endTime),
    isFinished,
    createdLocal:  formatDate(question.created)
  }
}