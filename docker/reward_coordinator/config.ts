import localConfig from './contractDeployments/localhost/config.json'
import rinkebyConfig from './contractDeployments/rinkeby/config.json'

import localPricingAbi from './contractDeployments/localhost/abis/LithiumPricing.json'
import rinkebyPricingAbi from './contractDeployments/rinkeby/abis/LithiumPricing.json'

const lithiumEnv = process.env.TARGET_CHAIN! || 'localhost'

export const CHAIN_IDS = {
  1337: 'Ganache Local',
  42: 'Kovan',
  4: 'Rinkeby'
}

const configs = {
  localhost: {
    Hardfork:"london",
    CHAIN_ID: 1337,
    pricingAbi: localPricingAbi,
    LITHIUM_PRICING_ADDRESS: localConfig.LithiumPricingAddress,
  },
  rinkeby: {
    Hardfork:"london",
    CHAIN_ID: 4,
    pricingAbi: rinkebyPricingAbi,
    LITHIUM_PRICING_ADDRESS: rinkebyConfig.LithiumPricingAddress,
  }
}

//@ts-ignore
export const config = configs[lithiumEnv]
