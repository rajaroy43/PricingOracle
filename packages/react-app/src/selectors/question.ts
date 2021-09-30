import { Question } from "lithium-subgraph"
import { generateAnswerSetOptions } from "../components/forms/AnswerQuestion"
import { formatUnits, msToSec, secToLocaleDate, msToLocaleDate } from "../helpers/formatters"
import { QuestionView } from "../types/question"
import { getTopAnswer } from "./common"

export const selectQuestion = (question: Question): QuestionView => {
  //TODO query a node to get the latest block time
  const now = msToSec(new Date().getTime())
  const isFinished = question.endTime < now
  const topAnswer = getTopAnswer(question.answerSetTotalStaked)
  const answerSetOptions = generateAnswerSetOptions(question.answerSet)
  return {
    ...question,
    // @ts-ignore
    answerSetTotalStakedDisplay: question.answerSetTotalStaked.map(formatUnits),
    bountyDisplay: formatUnits(question.bounty),
    totalStakedDisplay: formatUnits(question.totalStaked),
    endTimeLocal: secToLocaleDate(question.endTime),
    isFinished,
    createdLocal:  msToLocaleDate(question.created),
    pricingTimeDisplay: secToLocaleDate(question.pricingTime),
    topAnswerIndex: topAnswer.index,
    topAnswerValue: topAnswer.value.toString(),
    topAnswerDisplay: answerSetOptions[topAnswer.index].label
  }
}