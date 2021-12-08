
require('dotenv').config()
import { getEndedQuestionGroups } from "./queries/questionGroup"
import { getBidsToRefund, getQuestion } from "./queries/question"
import getRewards from "./getRewards"
import { updateInvalidAndRefund, updateValidAndReward } from "./transactions/publishReward"
import { AnswerStatus } from './types'
import getRefundsForTiers from "./utils/getRefundsForTiers"
import QUESTION_TIERED_ADDRESSES from "./storage/questionTieredAddresses"
import { publishBidderRefunds } from './transactions/publishBidderRefund'
import storePublicKeys from "./userPublicKeys/storePublicKeys"


const calculateQuestionGroup = async (group: any) => {
  console.log(`calculating group : ${group.id}`)
  const questions = await Promise.all(
    group.questions.map((question: any) => {
      return getQuestion(question.id, group.category.id)
    })
  )

  //@ts-ignore
  const answerCount = parseInt(questions[0].question.answerCount, 10)
  if (parseInt(group.minimumRequiredAnswers, 10) > answerCount) {
    console.log(`QuestionGroup ${group.id} INVALID, ${answerCount} Answers`)
  //@ts-ignore
    updateInvalidAndRefund(group, questions)
  } else {
    console.log(`QuestionGroup ${group.id} VALID, ${answerCount} Answers, getting rewards`)
    const groupData = {
      ...group,
      questions
    }
   
    const rewardsResponse = await getRewards(groupData)
    if (rewardsResponse.error) {
      console.log(`Error calculating rewards for group ${group.id}\nError Message: ${rewardsResponse.error}`)
    } else {
      console.log(`Got rewards response ${JSON.stringify(rewardsResponse.data)} -- ${rewardsResponse.data.rewards.answerStatus} -- ${AnswerStatus.Success}`)
      //const rewards = JSON.parse(rewardsResponse.data)
      if (rewardsResponse.data.rewards.answerStatus === AnswerStatus.Success) {
        console.log('Valid answer calculation')
        updateValidAndReward(rewardsResponse.data, questions)
      } else {
        console.log(`Invalid answer calculation ${group.id}`)
        updateInvalidAndRefund(group, questions)
      }
    }
  }

}

const fetchQuestionsToCalculate = async () => {
  console.log(`fetching questions to calculate`)

  const response = await getEndedQuestionGroups()
console.log(`got questions to calculate ${JSON.stringify(response.data.questionGroups)}`)
  if (response.error) {
    console.log(`Error fetching question groups: ${response.error}`)
    return 
  }

  await Promise.all(response.data.questionGroups.map(calculateQuestionGroup))
    
}

const handleBidRefunds = async (revealTiers: number[], question: any): Promise<void> => {
  console.log(`handling refunds for questionId ${question.id} - bid count ${question.bids.length}`)
  let tieredAddresses: any = []
  if (!QUESTION_TIERED_ADDRESSES.areTiersCalculated(question.id)) {
    tieredAddresses = getRefundsForTiers(revealTiers, question.bids)
    QUESTION_TIERED_ADDRESSES.setTieredAddresses(question.id, tieredAddresses, false)
  } else {
    tieredAddresses = QUESTION_TIERED_ADDRESSES.getTieredAddresses(question.id)
    if (tieredAddresses.refundsComplete) {
      console.log(`refunds already complete`)
      return 
    } else {
      const notRefunded = question.bids.filter((bid: any) => !bid.isRefunded)
      tieredAddresses = getRefundsForTiers(revealTiers, question.bids)

      if (notRefunded.length === 0) {
        QUESTION_TIERED_ADDRESSES.setTieredAddresses(question.id, tieredAddresses, true)
        return
      } else {
        QUESTION_TIERED_ADDRESSES.setTieredAddresses(question.id, tieredAddresses, false)
      }
    }
  }

  const refundArgs = {
    questionIds: [],
    addresses: [],
    amounts: []
  }
  const refundFields = tieredAddresses.reduce((acc: any, tier: any) => acc.concat(tier), [])
    .filter((bid: any) => !bid.isRefunded)
    .reduce((acc: any, bid: any) => {
      acc.questionIds.push(question.id)
      acc.addresses.push(bid.user.id)
      acc.amounts.push(bid.refundAmount)
      console.log(`inside reduce ${JSON.stringify(acc)}`)
      return acc
    }, refundArgs)

  console.log(`bid refund count ${refundFields.questionIds.length}`)

  if (refundFields.questionIds.length) {
    await publishBidderRefunds(refundFields)
  }

}

const fetchBidsToRefund = async () => {
  console.log(`fetching bids to refund`)
  const response = await getBidsToRefund()
  if (response.error) {
    console.log(`Error fetching bids to refund: ${response.error}`)
    return 
  }
  const revealTiers = response.data.pricingContractMeta.revealTiers
  await Promise.all(response.data.questions.map((question: any) => handleBidRefunds(revealTiers, question)))
  response.data.questions.forEach((question: any) => storePublicKeys(question))
}


console.log(`fetch interval ${process.env.FETCH_INTERVAL}`)

const interval = parseInt(process.env.FETCH_INTERVAL || '60000', 10)
setInterval(fetchQuestionsToCalculate, interval)
setInterval(fetchBidsToRefund, interval)