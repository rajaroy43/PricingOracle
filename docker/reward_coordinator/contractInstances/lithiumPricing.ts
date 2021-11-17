// import { Contract, utils, providers } from 'ethers'
import { Contract } from 'ethers'
import { coordinatorWallet } from "../client"
import { QuestionUpdateFields, ReputationUpdateFields, RewardUpdateFields } from "../types"
//@ts-ignore
import { config } from '../config'

// ethers
// @ts-ignore
// export const getLithiumTokenInstance = (provider: any) => new Contract(config.LITHIUM_TOKEN_ADDRESS, new utils.Interface(tokenAbi), new providers.Web3Provider(provider))
// @ts-ignore
// export const getLithiumPricingInstance = (provider: any) => new Contract(config.LITHIUM_PRICING_ADDRESS, new utils.Interface(pricingAbi), new providers.Web3Provider(provider))
export const lithiumPricing = (() => new Contract(config.LITHIUM_PRICING_ADDRESS, config.pricingAbi, coordinatorWallet))()

export const updateQuestionStatus = (
  updates: QuestionUpdateFields
) => { 
  return lithiumPricing.updateFinalAnswerStatus(
    updates.questionIds,
    updates.answerIndexes,
    updates.answerValues,
    updates.statuses
  ) 
}

export const updateRewards = (
  updates: RewardUpdateFields
) => {
  return lithiumPricing.updateGroupRewardAmounts(
    updates.addresses,
    updates.groupIds,
    updates.rewardAmounts
  ) 
}


export const updateReputations = (
  updates: ReputationUpdateFields
) => { 
  return lithiumPricing.updateRepuation(
    updates.addresses,
    updates.categoryIds,
    updates.scores
  ) 
}
