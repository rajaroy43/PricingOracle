export interface QuestionUpdateFields {
  questionIds: string[],
  answerIndexes: number[],
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

export enum AnswerStatus {
  Success,
  Failure,
}

export interface RewardsResponseData {
  answerStatus: AnswerStatus
  questionGroupId: string,
  questionGroupCategory: string,
  questionIds: string[],
  finalAnswerIndex: number[],
  finalAnswerValue: string[],
  wisdomNodeUpdates: [string, string, string][]
}
