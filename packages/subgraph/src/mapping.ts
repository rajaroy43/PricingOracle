import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AnswerGroupSetSubmitted,
  CategoryAdded,
  GroupRewardUpdated,
  FinalAnswerCalculatedStatus,
  QuestionCreated,
  QuestionGroupCreated,
  QuestionAnswered,
  ReputationUpdated,
  RewardClaimed,
  SetLithiumRewardAddress,
  SetLithiumTokenAddress
} from "../generated/LithiumPricing/LithiumPricing"

import { 
  Transfer,
  Approval
} from "../generated/LithiumToken/LithiumToken"

import {
  Answer,
  AnswerGroup,
  PricingContractMeta,
  Question,
  QuestionGroup,
  QuestionCategory,
  User,
  UserCategoryReputation
} from "../generated/schema"

let ZERO = BigInt.fromI32(0)
let ONE = BigInt.fromI32(1)

const PRICING_CONTRACT_META_ID = 'pricing_contract_meta'

let QUESTION_TYPES = new Array<String>(2)
QUESTION_TYPES[0] = "Pricing"
QUESTION_TYPES[1] = "GroundTruth"

function getAnswerId(answererAddress: string, questionId: string): string {
  return answererAddress + "-" + questionId
}

function getAnswerGroupId(ownerAddress: string, questionGroupId: string): string {
  return ownerAddress + "-" + questionGroupId
}

function getOrCreatePricingContractMeta(address: Address): PricingContractMeta {
  let meta = PricingContractMeta.load(PRICING_CONTRACT_META_ID)
  if (meta == null) {
    meta = new PricingContractMeta(PRICING_CONTRACT_META_ID)
    meta.address = address
    meta.save()
  }

  return meta as PricingContractMeta
}

function getOrCreateUserCategoryReputation(userId: string, categoryId: string): UserCategoryReputation {
  let id = userId + "-" + categoryId
  let userCategoryReputation = UserCategoryReputation.load(id)
  if (userCategoryReputation == null) {
    userCategoryReputation = new UserCategoryReputation(id)
    userCategoryReputation.user = userId
    userCategoryReputation.category = categoryId
    userCategoryReputation.score = ZERO
    userCategoryReputation.save()
  }

  return userCategoryReputation as UserCategoryReputation
}

function getOrCreateUser(address: string): User {
  let user = User.load(address)

  if (user == null) {
    user = new User(address)
    user.questionCount = ZERO
    user.totalBounty = ZERO
    user.answerCount = ZERO
    user.answerGroupCount = ZERO
    user.totalRewardsClaimed = ZERO
    user.totalStaked = ZERO
    user.tokenBalance = ZERO
    user.tokenApprovalBalance = ZERO

    user.save()
  }

  return user as User
}

function updateUserCategoryReputation(userId: string, categoryId: string, score: BigInt): void {
  let userCategoryReputation = getOrCreateUserCategoryReputation(userId, categoryId)
  userCategoryReputation.score = score
  userCategoryReputation.save()
}

export function handleReputationUpdated(event: ReputationUpdated): void {
  let categoryIds: Array<BigInt> = event.params.categoryIds
  let scores: Array<BigInt> = event.params.reputationScores
  let addresses: Array<Address> = event.params.addressesToUpdate
  for (let i = 0; i < categoryIds.length; i++) {
    let categoryId = categoryIds[i]
    let userId = addresses[i]
    let score = scores[i]
    updateUserCategoryReputation(userId.toHexString(), categoryId.toString(), score)
  }
}

export function handleSetLithiumRewardAddress(event: SetLithiumRewardAddress): void {
  let meta = getOrCreatePricingContractMeta(event.address)
  meta.rewardAddress = event.params.rewardAddress
  meta.save()
}

export function handleSetLithiumTokenAddress(event: SetLithiumTokenAddress): void {
  let meta = getOrCreatePricingContractMeta(event.address)
  meta.tokenAddress = event.params.lithiumTokenAddress
  meta.save()
}

export function handleCategoryAdded(event: CategoryAdded): void {
  let category = new QuestionCategory(event.params.id.toString())
  category.label = event.params.label
  category.questionCount = ZERO
  category.totalBounty = ZERO
  category.totalStaked = ZERO
  category.rewardedQuestionCount = ZERO
  category.save()
}

export function handleQuestionCreated(event: QuestionCreated): void {
  let ownerAddress = event.params.owner.toHexString()

  let user = getOrCreateUser(ownerAddress)
  user.questionCount = user.questionCount.plus(ONE)
  user.totalBounty = user.totalBounty.plus(event.params.bounty)
  user.save()

  let answerSetTotalStaked = new Array<BigInt>(event.params.answerSet.length)
  answerSetTotalStaked.fill(ZERO)

  let question = new Question(event.params.id.toString())
  question.owner = user.id
  question.questionType = QUESTION_TYPES[event.params.questionType]
  question.category = BigInt.fromI32(event.params.categoryId).toString()
  question.description = event.params.description
  question.answerSet = event.params.answerSet
  question.answerSetTotalStaked = answerSetTotalStaked
  question.bounty = event.params.bounty
  question.totalStaked = ZERO
  question.answerCount = ZERO
  question.finalAnswerIndex = ZERO.toI32()
  question.finalAnswerValue = ZERO
  question.endTime = event.params.endTime
  question.pricingTime = event.params.pricingTime
  question.isAnswerCalculated = "NotCalculated"
  question.created = event.block.timestamp
  question.save()

  let category = QuestionCategory.load(BigInt.fromI32(event.params.categoryId).toString())
  category.questionCount = category.questionCount.plus(ONE)
  category.totalBounty = category.totalBounty.plus(event.params.bounty)
  category.save()
}

function updateFinalAnswer(questionId: string, answerIndex: string, answerValue: string ): void {
  let question = Question.load(questionId)
  question.finalAnswerIndex =  BigInt.fromString(answerIndex).toI32()
  question.finalAnswerValue = BigInt.fromString(answerValue)
  question.save()
}

export function handleFinalAnswerCalculatedStatus(event: FinalAnswerCalculatedStatus): void {
  let questionIds: Array<BigInt> = event.params.questionIds
  let answerIndexes: Array<BigInt> = event.params.answerIndexes
  let answerValues: Array<BigInt> = event.params.answerValues
  for (let i = 0; i < questionIds.length; i++) {
    let questionId = questionIds[i]
    let answerIndex = answerIndexes[i]
    let answerValue = answerValues[i]
    updateFinalAnswer(questionId.toString(), answerIndex.toString(), answerValue.toString())
  }
}

export function handleQuestionGroupCreated(event: QuestionGroupCreated): void {
  let id = event.params.id.toString()
  let questionGroup = new QuestionGroup(id)
  let questionIds: Array<BigInt> = event.params.questionIds
  let questionIdStrings: Array<string>
  let endTime = ZERO
  for(let i = 0; i < questionIds.length; i++) {
    let questionId = questionIds[i]
    let id = questionId.toString()
    let question = Question.load(id)
    if (endTime < question.endTime) {
      endTime = question.endTime
    }
    questionIdStrings.push(id)
  }
  questionGroup.questions = questionIdStrings
  questionGroup.endTime = endTime
  questionGroup.save()
}

export function handleQuestionAnswered(event: QuestionAnswered): void {
  let answererAddress = event.params.answerer.toHexString()

  let user = getOrCreateUser(answererAddress)
  user.answerCount = user.answerCount.plus(ONE)
  user.totalStaked = user.totalStaked.plus(event.params.stakeAmount)
  user.save()

  let question = Question.load(event.params.questionId.toString())
  question.totalStaked = question.totalStaked.plus(event.params.stakeAmount)
  question.answerCount = question.answerCount.plus(ONE)
  let answerSetTotalStaked = question.answerSetTotalStaked as BigInt[]
  let currentAnswerTotal: BigInt | null
  currentAnswerTotal = answerSetTotalStaked[event.params.answerIndex] as BigInt
  if (currentAnswerTotal == null) {
    currentAnswerTotal = event.params.stakeAmount
  } else {
    currentAnswerTotal = currentAnswerTotal.plus(event.params.stakeAmount)
  }
  answerSetTotalStaked[event.params.answerIndex] = currentAnswerTotal as BigInt
  question.answerSetTotalStaked = answerSetTotalStaked
  question.save()

  let answerId = getAnswerId(event.params.answerer.toHexString(), event.params.questionId.toString())
  let answer = new Answer(answerId)
  answer.answerer = user.id
  answer.question = event.params.questionId.toString()
  answer.answerIndex = event.params.answerIndex
  answer.stakeAmount = event.params.stakeAmount
  answer.created = event.block.timestamp
  answer.save()
}

export function handleAnswerGroupSetSubmitted(event: AnswerGroupSetSubmitted): void {
  let owner = User.load(event.params.answerer.toHexString())
  let questionGroupId = event.params.questionSetId.toString()
  let answerGroupId = getAnswerGroupId(owner.id, questionGroupId)
  let questionGroup = QuestionGroup.load(questionGroupId)
  let answerIds = new Array<String>(questionGroup.questions.length)

  let questions = questionGroup.questions as string[]
  
  for(let i = 0; i < questions.length;i++) {
    let questionId = questions[i]
    let answerId = getAnswerId(owner.id, questionId)
    answerIds.push(answerId)
  }

  let answerGroup = new AnswerGroup(answerGroupId)
  answerGroup.owner = owner.id
  answerGroup.questionGroup = questionGroupId
  answerGroup.answers = answerIds
  answerGroup.isRewardCalculated = "NotCalculated"
  answerGroup.rewardAmount = ZERO
  answerGroup.status = "Unclaimed"
  answerGroup.save()

  owner.answerGroupCount = owner.answerGroupCount.plus(ONE)
  owner.save()
}

function updateGroupReward(answerGroupId: string, amount: BigInt): void {
  let answerGroup = AnswerGroup.load(answerGroupId)
  answerGroup.rewardAmount = amount
  answerGroup.isRewardCalculated = "Calculated"
  answerGroup.save()
}

export function handleGroupRewardUpdated(event: GroupRewardUpdated): void {
  let groupIds: Array<BigInt> = event.params.groupIds
  let addresses: Array<Address> = event.params.addressesToUpdate
  let rewardAmounts: Array<BigInt> = event.params.rewardAmounts
  for (let i = 0; i < groupIds.length; i++) {
    let questionGroupId = groupIds[i]
    let address = addresses[i]
    let answerGroupId = getAnswerGroupId(address.toHexString(), questionGroupId.toString())
    let amount = rewardAmounts[i]
    updateGroupReward(answerGroupId, amount)
  }
}

export function handleRewardClaimed(event: RewardClaimed): void {
  let answererAddress = event.params.answerer.toHexString()
  let user = User.load(answererAddress)
  user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.rewardAmount)
  user.save()

  let answerGroupId = getAnswerGroupId(user.id, event.params.questionGroupId.toString())
  let answerGroup = AnswerGroup.load(answerGroupId)
  answerGroup.status = "Claimed"
  answerGroup.save()
}

export function handleTransfer(event: Transfer): void {
  let senderAddress = event.params.from.toHexString()

  let sender = getOrCreateUser(senderAddress)
  
  sender.tokenBalance = sender.tokenBalance.minus(event.params.value)
  sender.save()


  let receiverAddress = event.params.to.toHexString()

  let receiver = getOrCreateUser(receiverAddress)
  
  receiver.tokenBalance = receiver.tokenBalance.plus(event.params.value)
  receiver.save()
}

export function handleApproval(event: Approval): void {
  let appoverAddress = event.params.owner.toHexString()

  let approver = getOrCreateUser(appoverAddress)
  
  let pricingMeta = PricingContractMeta.load(PRICING_CONTRACT_META_ID)
  if (pricingMeta.address == event.params.spender) {
    approver.tokenApprovalBalance = approver.tokenApprovalBalance.plus(event.params.value)
    approver.save()
  }
}
