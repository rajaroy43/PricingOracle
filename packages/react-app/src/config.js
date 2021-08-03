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
  },
  TESTNET: {
    CHAIN_ID: 4,
    LITHIUM_TOKEN_ADDRESS: "0x4851ee6d06e6A7447eB58F503AF2F5452A11f748",
    LITHIUM_PRICING_ADDRESS: "0x8D555d45D60a57eB8d2DA7562d7213ae91F71f0d",
    LITHIUM_SUBGRAPH: "https://api.studio.thegraph.com/query/4730/lithium-finance/v0.0.1"
  }
}

https://api.studio.thegraph.com/query/4730/lithium-finance/v0.0.1

const lithiumEnv = process.env.LITHIUM_APP_ENV || 'DEV'

export default config[lithiumEnv]