import { BigInt, dataSource, log } from "@graphprotocol/graph-ts"
import {
  QuestionCreated,
  QuestionAnswered,
  RewardClaimed
} from "../generated/LithiumPricing/LithiumPricing"
import { 
  Transfer,
  Approval
} from "../generated/LithiumToken/LithiumToken"
import { User, Question, Answer } from "../generated/schema"

let ZERO = BigInt.fromI32(0)
let ONE = BigInt.fromI32(1)

function getOrCreateUser(address: string): User {
  let user = User.load(address)

  if (user == null) {
    user = new User(address)
    user.questionCount = ZERO
    user.totalBounty = ZERO
    user.answerCount = ZERO
    user.totalRewardsClaimed = ZERO
    user.totalStaked = ZERO
    user.tokenBalance = ZERO
    user.tokenApprovalBalance = ZERO

    user.save()
  }

  return user as User
}

export function handleQuestionCreated(event: QuestionCreated): void {

  let ownerAddress = event.params.owner.toHexString()

  let user = getOrCreateUser(ownerAddress)
  user.questionCount = user.questionCount.plus(ONE)
  user.totalBounty = user.totalBounty.plus(event.params.bounty)
  user.save()

  let answerSetTotals = new Array<BigInt>(event.params.answerSet.length)
  answerSetTotals.fill(ZERO)

  let question = new Question(event.params.id.toString())
  question.owner = user.id
  question.categoryId = event.params.categoryId
  question.description = event.params.description
  question.answerSet = event.params.answerSet
  question.answerSetTotals = answerSetTotals
  question.bounty = event.params.bounty
  question.totalStaked = ZERO
  question.answerCount = ZERO
  question.endTime = event.params.endTime
  question.created = event.block.timestamp
  question.save()
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
  let answerSetTotals = question.answerSetTotals as BigInt[]
  let currentAnswerTotal: BigInt | null
  currentAnswerTotal = answerSetTotals[event.params.answerIndex] as BigInt
  if (currentAnswerTotal == null) {
    currentAnswerTotal = event.params.stakeAmount
  } else {
    currentAnswerTotal = currentAnswerTotal.plus(event.params.stakeAmount)
  }
  answerSetTotals[event.params.answerIndex] = currentAnswerTotal as BigInt
  question.answerSetTotals = answerSetTotals
  question.save()

  let answer = new Answer(event.params.questionId.toString() + '-' + answererAddress)
  answer.answerer = user.id
  answer.question = event.params.questionId.toString()
  answer.answerIndex = event.params.answerIndex
  answer.stakeAmount = event.params.stakeAmount
  answer.rewardClaimed = ZERO
  answer.status = "UNCLAIMED"
  answer.save()
}

export function handleRewardClaimed(event: RewardClaimed): void {

  let answererAddress = event.params.answerer.toHexString()

  let user = User.load(answererAddress)
  user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.rewardAmount)
  user.save()

  let answer = new Answer(event.params.questionId.toString() + '-' + answererAddress)
  answer.rewardClaimed = event.params.rewardAmount
  answer.status = "CLAIMED"
  answer.save()
}

export function handleTransfer(event: Transfer): void {
  let senderAddress = event.params.from.toHexString()

  let sender = getOrCreateUser(senderAddress)
  
  sender.tokenBalance = sender.tokenBalance.minus(event.params.value)
  sender.save()


  let receiverAddress = event.params.to.toHexString()

  let receiver = getOrCreateUser(receiverAddress)
  
  receiver.tokenBalance = receiver.tokenBalance.minus(event.params.value)
  receiver.save()
}


export function handleApproval(event: Approval): void {
  let appoverAddress = event.params.owner.toHexString()

  let approver = getOrCreateUser(appoverAddress)
  log.info('dataSource address {}', [dataSource.address().toString()])
  
  let pricingAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'// config.LithiumPricingAddress as string
  if (pricingAddress == event.params.owner.toHexString()) {
    approver.tokenApprovalBalance = event.params.value
    approver.save()
  }
}
