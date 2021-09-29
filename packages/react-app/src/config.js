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
    LITHIUM_TOKEN_ADDRESS: "0xD54e04F657Cd8b59959b4B8dd157595eAf163A4a",
    LITHIUM_PRICING_ADDRESS: "0x31f6b8FbCF4C3182A8ac117ef9a2cB988d91B6e2",
    LITHIUM_SUBGRAPH: "https://api.studio.thegraph.com/query/4730/lithium-finance/v0.0.6"
  }
}


export default config[lithiumEnv]