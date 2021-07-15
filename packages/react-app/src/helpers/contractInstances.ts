import { Contract, utils, providers } from 'ethers'
import config from "../config"
import tokenAbi from '../contracts/LithiumToken.abi'
import pricingAbi from '../contracts/LithiumPricing.abi'

console.log(`token addr ${config.LITHIUM_TOKEN_ADDRESS} -- ${config.LITHIUM_PRICING_ADDRESS}`)
// @ts-ignore
export const getLithiumTokenInstance = (provider: any) => new Contract(config.LITHIUM_TOKEN_ADDRESS, new utils.Interface(tokenAbi), new providers.Web3Provider(provider))
// @ts-ignore
export const getLithiumPricingInstance = (provider: any) => new Contract(config.LITHIUM_PRICING_ADDRESS, new utils.Interface(pricingAbi), new providers.Web3Provider(provider))

