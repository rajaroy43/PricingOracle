
export interface MultiHashFields {
  digest: string,
  hashFunction: number,
  size: number
}

export interface UpdateInvalidAnswerFields {
  questionIds: string[]
}

export interface AddAnswerHashFields {
  questionIds : string[],
  answerHashes: MultiHashFields[]
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

export interface RefundBidsFields {
  questionIds: string[],
  addresses: string[],
  amounts: string[]
}

export enum AnswerStatus {
  Success,
  Failure,
}

export interface RewardsResponseData {
  rewards: {
    answerStatus: AnswerStatus
    questionGroupId: string,
    questionGroupCategory: string,
    questionIds: string[],
    finalAnswerIndex: number[],
    finalAnswerValue: string[],
    wisdomNodeUpdates: [string, string, string][]
  }
}

export interface CalculatorResponse {
  data: RewardsResponseData,
  error: any
}

export interface Bidder {
  address: string,
  publicKey: string
}

export interface EncryptedAnswerDocument {
  questionId: string,
  description: string,
  pricingTime: string,
  answerSet: string
  answers: {[key: string]: string}
}