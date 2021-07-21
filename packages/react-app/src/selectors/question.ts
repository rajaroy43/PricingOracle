import { Question } from "lithium-subgraph"
import { generateAnswerSetOptions } from "../components/forms/AnswerQuestion"
import { formatUnits, formatDate } from "../helpers/formatters"
import { QuestionView } from "../types/question"
import { getTopAnswer } from "./common"

export const selectQuestion = (question: Question): QuestionView => {
  //TODO query a node to get the latest block time
  const now = new Date().getTime() / 1000
  const isFinished = question.endTime < now
  const topAnswer = getTopAnswer(question.answerSetTotals)
  const answerSetOptions = generateAnswerSetOptions(question.answerSet)
  return {
    ...question,
    // @ts-ignore
    answerSetTotalsDisplay: question.answerSetTotals.map(formatUnits),
    bountyDisplay: formatUnits(question.bounty),
    totalStakedDisplay: formatUnits(question.totalStaked),
    endTimeLocal: formatDate(question.endTime),
    isFinished,
    createdLocal:  formatDate(question.created),
    topAnswerIndex: topAnswer.index,
    topAnswerValue: topAnswer.value.toString(),
    topAnswerDisplay: answerSetOptions[topAnswer.index].label
  }
}