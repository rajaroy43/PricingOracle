import { BigNumber } from "ethers"
import { updateQuestionStatus, updateReputations, updateRewards } from "./contractInstances/lithiumPricing"
import { QuestionUpdateFields, RewardsResponseData, RewardUpdateFields } from "./types"

export const publishAnswersRewards = (
  questionUpdate: QuestionUpdateFields,
  rewardUpdates: RewardUpdateFields
) => {
  updateQuestionStatus(
    questionUpdate
  )

  updateRewards(
    rewardUpdates
  )
}

export const publishInvalidAnswers = async (
  questionIds: string[],
  rewardUpdates: RewardUpdateFields
) => {
  const INVALID_STATUS = 2
  const answerValues = questionIds.map(() => "0")
  const answerIndexes = questionIds.map(() => 0)
  const statuses = questionIds.map(() => INVALID_STATUS)
  const statusTx = await updateQuestionStatus({
    questionIds,
    answerIndexes,
    answerValues,
    statuses
  })

  await statusTx.wait()

  console.log((`got statusTx ${statusTx}`))

  const rewardsTx = await updateRewards(
    rewardUpdates
  )

  await rewardsTx.wait()

  console.log((`got rewardsTx ${rewardsTx}`))
}

export const updateInvalidAndRefund = (group: any, questions: any) => {
  console.log(`QuestionGroup ${group.id} INVALID`)
  //@ts-ignore
  const answerCount = parseInt(questions[0].question.answerCount, 10)
  const questionIds = group.questions.map((question: any) => question.id)
  const groupIds = Array(answerCount).fill(group.id)

  const answerStakes = questions
    .map(({question}: any) => question.answers)
    .reduce((acc:any, answers:any) => acc.concat(answers), [])
    .reduce((acc: any, answer: any) => {
      const answererId = answer.answerer.id
      if (acc.hasOwnProperty(answererId)) {
        acc[answererId] = acc[answererId].add(BigNumber.from(answer.stakeAmount))
      } else {
        acc[answererId] = BigNumber.from(answer.stakeAmount)
      } 
      return acc
    }, {})

  const addresses = Object.keys(answerStakes)
  const rewardAmounts = addresses.map((addr: string) => answerStakes[addr].toString())
  console.log(`publishing invalid questions: ${questionIds}\nstake refunds groupIds\n${groupIds}\n${addresses}\n${JSON.stringify(rewardAmounts)}`)
  return publishInvalidAnswers(
    questionIds,
    {
      groupIds,
      addresses,
      rewardAmounts
    }
  )
}

export const updateQuestionStatusAndReward = async (response: RewardsResponseData) => {
  const statuses = new Array(response.questionIds.length).fill(response.answerStatus)
  const statusTx = await updateQuestionStatus({
    questionIds: response.questionIds ,
    answerIndexes: response.finalAnswerIndex,
    answerValues: response.finalAnswerValue,
    statuses
  })


  console.log((`got statusTx ${statusTx}`))

  const groupIds = new Array(response.wisdomNodeUpdates.length).fill(response.questionGroupId)
  const addressRewards = response.wisdomNodeUpdates.reduce(
    (acc: any, update: any) => {
      acc[0].push(update[0])
      acc[1].push(update[1])
      acc[2].push(update[2])
      return acc
     },[[],[],[]])
  const rewardsTx = await updateRewards({
    addresses: addressRewards[0],
    groupIds,
    rewardAmounts: addressRewards[1]
  })
  await rewardsTx.wait()

  console.log((`got rewardsTx ${rewardsTx}`))

  const categoryIds = new Array(addressRewards[0].length).fill(response.questionGroupCategory)

  const reputationTx = await updateReputations({
    addresses: addressRewards[0],
    categoryIds,
    scores: addressRewards[2]
  })
  await reputationTx.wait()

}
