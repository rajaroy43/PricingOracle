// import { Contract, utils, providers } from 'ethers'
import config from "../config"

// ethers
// @ts-ignore
// export const getLithiumTokenInstance = (provider: any) => new Contract(config.LITHIUM_TOKEN_ADDRESS, new utils.Interface(tokenAbi), new providers.Web3Provider(provider))
// @ts-ignore
// export const getLithiumPricingInstance = (provider: any) => new Contract(config.LITHIUM_PRICING_ADDRESS, new utils.Interface(pricingAbi), new providers.Web3Provider(provider))

const getDeployedContract = (web3: any, abi: any, address: string) => {
  const contract =  new web3.eth.Contract(abi, address)
  return contract
}

export const getLithiumTokenInstance = (web3: any) => getDeployedContract(web3, config.tokenAbi, config.LITHIUM_TOKEN_ADDRESS)
export const getLithiumPricingInstance = (web3: any) => getDeployedContract(web3, config.pricingAbi, config.LITHIUM_PRICING_ADDRESS)

