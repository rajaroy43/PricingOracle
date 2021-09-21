import { updateQuestionStatus, updateRewards } from "./contractInstances/lithiumPricing"
import { QuestionUpdateFields, RewardUpdateFields } from "./types"


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
  groupIds: string[],
  addresses: string[],
  rewardAmounts: string[]
) => {
  const INVALID_STATUS = "2"
  const answerValues = questionIds.map(() => "0")
  const answerIndexes = questionIds.map(() => "0")
  const statuses = questionIds.map(() => INVALID_STATUS)
  await  updateQuestionStatus({
    questionIds,
    answerIndexes,
    answerValues,
    statuses
  })

}