// import { Contract, utils, providers } from 'ethers'
import addresses from "../config/config.json"
import pricingAbi from '../abis/LithiumPricing.json'
import { Contract } from 'ethers'
import { coordinatorWallet } from "../client"
import { QuestionUpdateFields, ReputationUpdateFields, RewardUpdateFields } from "../types"


// ethers
// @ts-ignore
// export const getLithiumTokenInstance = (provider: any) => new Contract(config.LITHIUM_TOKEN_ADDRESS, new utils.Interface(tokenAbi), new providers.Web3Provider(provider))
// @ts-ignore
// export const getLithiumPricingInstance = (provider: any) => new Contract(config.LITHIUM_PRICING_ADDRESS, new utils.Interface(pricingAbi), new providers.Web3Provider(provider))
const lithiumPricing = (() => new Contract(addresses.LithiumPricingAddress, pricingAbi, coordinatorWallet))()

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
  console.log(`broadcastin reward update addresses:\b${updates.addresses}\ngroups:\n${updates.groupIds}\nrewards\n${updates.rewardAmounts}`) 
  return lithiumPricing.updateGroupRewardAmounts(
    updates.addresses,
    updates.groupIds,
    updates.rewardAmounts
  ) 
}


export const updateReputations = (
  updates: ReputationUpdateFields
) => { 
  lithiumPricing.updateRepuation(
    updates.addresses,
    updates.categoryIds,
    updates.scores
  ) 
}
