import { BigNumber } from "@ethersproject/bignumber"
import { Question, QuestionBid } from "lithium-subgraph"
import { formatNumber, formatUnits, msToSec, secToLocaleDate, msToLocaleDate } from "../helpers/formatters"
import getBidTiers from "../helpers/getBidTiers"
import { QuestionView, QuestionBidView, QuestionAndBidsView, UserBidTierView } from "../types/question"
import { getTopAnswer } from "./common"

export const generateAnswerSetOptions = (answerSet: string[]) => {
  return answerSet.map((answer: string, index: number) => {
    if (index === answerSet.length - 1) {
      return {label: `Greater Than or Equal to ${formatNumber(answer)}`, value: index}
    } else {
      return {label: `Greater Than or Equal to ${formatNumber(answer)} or Less Than ${formatNumber(answerSet[index+1])}`, value: index}
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
  const isBiddingOpen = question.startTime > now
  const isAnsweringOpen = !isBiddingOpen && !isFinished
  const topAnswer = getTopAnswer(question.answerSetTotalStaked)
  const answerSetOptions = generateAnswerSetOptions(question.answerSet)

  // there should only be a single user bid on the question
  // all question bids are fetched on a separate query
  const userBidView = question.bids && question.bids.length ?
    selectQuestionBid(question.bids[0])
    :
    null
  return {
    ...question,
    // @ts-ignore
    answerSetTotalStakedDisplay: question.answerSetTotalStaked.map(formatUnits),

    answerSetDisplay: question.answerSet.map(answer => formatNumber(answer)),
    bountyDisplay: formatNumber(formatUnits(question.bounty)),
    totalStakedDisplay: formatUnits(question.totalStaked),
    endTimeLocal: secToLocaleDate(question.endTime),
    isFinished,
    isBiddingOpen,
    isAnsweringOpen,
    createdLocal:  msToLocaleDate(question.created),
    pricingTimeDisplay: secToLocaleDate(question.pricingTime),
    topAnswerIndex: topAnswer.index,
    topAnswerValue: topAnswer.value.toString(),
    topAnswerDisplay: answerSetOptions[topAnswer.index].label,
    userBidView
  }
}

export const selectQuestionAndBids = (question: Question, revealTiers: number[]): QuestionAndBidsView => {
  const questionView = selectQuestion(question)
  const bids = question.bids || []
  const bidViews = bids.map(selectQuestionBid)
  const questionBidsView = {
    bidViews,
    topBid: bidViews.length ? bidViews[0] : null,
    tierFloors: ['0']
  }
  return {
    ...questionView,
    questionBidsView
  }
}

export const selectUserBidQuestion = (bid: QuestionBid,  revealTiers: number[]): QuestionAndBidsView => {
  const userBidView = selectQuestionBid(bid)
  const questionView = selectQuestionAndBids(bid.question, revealTiers)

  return {
    ...questionView,
    userBidView
  }
}

export const selectUserBidTier = (userBidView: QuestionBidView, questionAndBids: QuestionAndBidsView, revealTiers: number[]): UserBidTierView => {
  const {tieredBids, tierRanges} = getBidTiers(revealTiers, questionAndBids.bids)
  const isTopBid = userBidView.amount ===  tieredBids[0][0].amount
  const bidTierIdx = tierRanges.findIndex((tier: string[]) => tier[0] >= userBidView.amount && tier[1] <= userBidView.amount)
  const isTopTier = bidTierIdx === 0
  const bidTier = bidTierIdx + 1
  let nextBidTier = 0
  let amountNextTier = '0'
  let amountNextTierDisplay = '0'

  if (!isTopTier) {
    const nextTierFloor = tieredBids[bidTierIdx - 1]
    nextBidTier = bidTier - 1
    amountNextTier = BigNumber.from(nextTierFloor.amount).add(1).toString()
    amountNextTierDisplay = formatUnits(amountNextTier)
  }

  return {
    amountNextTier,
    amountNextTierDisplay,
    bidTier,
    isTopBid,
    isTopTier,
    nextBidTier
  }
}
