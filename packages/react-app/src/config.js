import tokenAddress from './contracts/LithiumToken.address'
import pricingAddress from './contracts/LithiumPricing.address'

const lithiumEnv = process.env.REACT_APP_ENV || 'DEV'

export const CHAIN_IDS = {
  1337: 'Ganache Local',
  42: 'Kovan',
  4: 'Rinkeby'
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
    LITHIUM_TOKEN_ADDRESS: "0x2601EE7d4392d3F5fe41e91de9035c6c07241d78",
    LITHIUM_PRICING_ADDRESS: "0xDBCB890BFcB55Bdb12C8B244cFF16072B29976C4",
    LITHIUM_SUBGRAPH: "https://api.studio.thegraph.com/query/4730/lithium-finance/v0.0.5"
  }
}


export default config[lithiumEnv]