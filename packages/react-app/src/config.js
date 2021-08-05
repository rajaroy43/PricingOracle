import tokenAddress from './contracts/LithiumToken.address'
import pricingAddress from './contracts/LithiumPricing.address'

export const CHAIN_IDS = {
  1337: 'Ganache Local',
  42: 'Kovan'
}

const config = {
  DEV: {
    CHAIN_ID: 1337,
    LITHIUM_TOKEN_ADDRESS: tokenAddress,
    LITHIUM_PRICING_ADDRESS: pricingAddress,
    LITHIUM_SUBGRAPH: "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"
  }
}

const lithiumEnv = process.env.LITHIUM_APP_ENV || 'DEV'

export default config[lithiumEnv]