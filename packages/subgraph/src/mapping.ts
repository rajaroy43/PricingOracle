import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AnswerGroupSetSubmitted,
  CategoryAdded,
  QuestionCreated,
  QuestionGroupCreated,
  QuestionAnswered,
  RewardClaimed,
  RewardCalculatedStatus,
  SetLithiumRewardAddress,
  SetLithiumTokenAddress
} from "../generated/LithiumPricing/LithiumPricing"

import { 
  Transfer,
  Approval
} from "../generated/LithiumToken/LithiumToken"
import {
  User,
  Question,
  QuestionGroup,
  Answer,
  AnswerGroup,
  QuestionCategory,
  PricingContractMeta
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
  question.endTime = event.params.endTime
  question.pricingTime = event.params.pricingTime
  question.isRewardCalculated = "NotCalculated"
  question.created = event.block.timestamp
  question.save()

  let category = QuestionCategory.load(BigInt.fromI32(event.params.categoryId).toString())
  category.questionCount = category.questionCount.plus(ONE)
  category.totalBounty = category.totalBounty.plus(event.params.bounty)
  category.save()
}

export function handleQuestionGroupCreated(event: QuestionGroupCreated): void {
  let id = event.params.id.toString()
  let questionGroup = new QuestionGroup(id)
  let questionIds = event.params.questionIds as string[]
  let endTime = ZERO
  for(let i = 0; i < questionIds.length; i++) {
    let question = Question.load(questionIds[i])
    if (endTime < question.endTime) {
      endTime = question.endTime
    }
  }
  questionGroup.questions = questionIds
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
  answer.rewardClaimed = ZERO
  answer.status = "Unclaimed"
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
  answerGroup.save()

  owner.answerGroupCount = owner.answerGroupCount.plus(ONE)
  owner.save()
}

export function handleRewardClaimed(event: RewardClaimed): void {
  let answererAddress = event.params.answerer.toHexString()
  let user = User.load(answererAddress)
  user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.rewardAmount)
  user.save()

  let answer = new Answer(event.params.questionId.toString() + '-' + answererAddress)
  answer.rewardClaimed = event.params.rewardAmount
  answer.status = "Claimed"
  answer.save()
}

export function handleRewardCalculatedStatus(event: RewardCalculatedStatus): void {
  let question = Question.load(event.params.questionId.toString())
  question.isRewardCalculated = "Calculated"
  question.save()
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
