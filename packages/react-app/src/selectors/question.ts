import { Question, QuestionBid } from "lithium-subgraph"
import { formatUnits, msToSec, secToLocaleDate, msToLocaleDate } from "../helpers/formatters"
import { QuestionView, QuestionBidView } from "../types/question"
import { getTopAnswer } from "./common"

export const generateAnswerSetOptions = (answerSet: string[]) => {
  return answerSet.map((answer: string, index: number) => {
    if (index === answerSet.length - 1) {
      return {label: `Greater Than or Equal to ${answer}`, value: index}
    } else {
      return {label: `Greater Than or Equal to ${answer} or  Less Than ${answerSet[index+1]}`, value: index}
    }
  })
}

export const selectQuestionBid = (bid: QuestionBid): QuestionBidView => {
  return {
    ...bid,
    amountDisplay: formatUnits(bid.amount)
  }
}

export const selectQuestion = (question: Question): QuestionView => {
  //TODO query a node to get the latest block time
  const now = msToSec(new Date().getTime())
  const isFinished = question.endTime < now
  const topAnswer = getTopAnswer(question.answerSetTotalStaked)
  const answerSetOptions = generateAnswerSetOptions(question.answerSet)

  // there should only be a single user bid on the question
  // all question bids are fetched on a separate query
  const userBidView = question.bids && question.bids.length ?
    selectQuestionBid(question.bids[0])
    :
    undefined
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
    topAnswerDisplay: answerSetOptions[topAnswer.index].label,
    userBidView

  }
}
