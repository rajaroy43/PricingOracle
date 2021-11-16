// @ts-ignore
import targetConfig from `./contractDeployments/${process.env.TARGET_CHAIN!}/config.json`
// import rinkebyConfig from './contractDeployments/rinkeby/config.json'

// @ts-ignore
import pricingAbi from `./contractDeployments/${process.env.TARGET_CHAIN!}/abis/LithiumPricing.json`

const targetConfigs = {
  pricingAbi,
  LITHIUM_PRICING_ADDRESS: targetConfig.LithiumPricingAddress
}
const lithiumEnv = process.env.TARGET_CHAIN!

export const CHAIN_IDS = {
  1337: 'Ganache Local',
  42: 'Kovan',
  4: 'Rinkeby'
}

const configs = {
  localhost: {
    CHAIN_ID: 1337,
    ...targetConfigs
  },
  rinkeby: {
    CHAIN_ID: 4,
    ...targetConfigs
  }
}

//@ts-ignore
export const config = configs[lithiumEnv]