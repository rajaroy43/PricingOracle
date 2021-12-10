import { BigNumber } from "ethers"
import { updateValidAnswer, updateInvalidAnswer, updateReputations, updateRewards } from "../contractInstances/lithiumPricing"
import { RewardsResponseData, RewardUpdateFields } from "../types"
import { handleQuestionAnswers } from "../utils/encryptedAnswers"
import getMultihashFromBytes32 from "../utils/getMultihash"

export const publishInvalidAnswers = async (
  questionIds: string[],
  rewardUpdates: RewardUpdateFields
) => {
  const statusTx = await updateInvalidAnswer({
    questionIds
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

export const updateValidAndReward = async (response: RewardsResponseData, questions: any) => {
  const {questionIds, wisdomNodeUpdates, questionGroupId, questionGroupCategory} = response.rewards
  // TODO get bytes32 for uploaded documents to IPFS
  const answerDocuments = await handleQuestionAnswers(response, questions)
  console.log(`got encrypted answer documents ${answerDocuments.length} ${answerDocuments[0]}`)
  const DUMMY_BYTES = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB'
  const answerHashes = new Array(questionIds.length).fill(getMultihashFromBytes32(DUMMY_BYTES))
  const statusTx = await updateValidAnswer({
    questionIds,
    answerHashes
  })


  console.log((`got statusTx ${JSON.stringify(statusTx, null, 2)}`))

  const groupIds = new Array(wisdomNodeUpdates.length).fill(questionGroupId)
  const addressRewards = wisdomNodeUpdates.reduce(
    (acc: any, update: any) => {
      acc[0].push(update[0])
      acc[1].push(update[1])
      acc[2].push(update[2])
      return acc
     },[[],[],[]])
  console.log(`Updating rewards ${addressRewards}`)
  const rewardsTx = await updateRewards({
    addresses: addressRewards[0],
    groupIds,
    rewardAmounts: addressRewards[1]
  })
  await rewardsTx.wait()

  console.log((`got rewardsTx ${JSON.stringify(rewardsTx, null, 2)}`))

  const categoryIds = new Array(addressRewards[0].length).fill(questionGroupCategory)

  const reputationTx = await updateReputations({
    addresses: addressRewards[0],
    categoryIds,
    scores: addressRewards[2]
  })
  await reputationTx.wait()

}
