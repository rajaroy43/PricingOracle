export interface QuestionUpdateFields {
  questionIds: string[],
  answerIndexes: string[],
  answerValues: string[],
  statuses: number[]
}

export interface RewardUpdateFields {
  addresses: string[],
  groupIds: string[],
  rewardAmounts: string[]
}

export interface ReputationUpdateFields {
  addresses: string[],
  categoryIds: string[],
  scores: string[]
}
