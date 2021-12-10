import localConfig from './contractDeployments/localhost/config.json'
import rinkebyConfig from './contractDeployments/rinkeby/config.json'
import goerliConfig from './contractDeployments/goerli/config.json'

import localTokenAbi from './contractDeployments/localhost/abis/LithiumToken.abi'
import localPricingAbi from './contractDeployments/localhost/abis/LithiumPricing.abi'

import rinkebyTokenAbi from './contractDeployments/rinkeby/abis/LithiumToken.abi'
import rinkebyPricingAbi from './contractDeployments/rinkeby/abis/LithiumPricing.abi'

import goerliTokenAbi from './contractDeployments/goerli/abis/LithiumToken.abi'
import goerliPricingAbi from './contractDeployments/goerli/abis/LithiumPricing.abi'

const lithiumEnv = process.env.REACT_APP_ENV || 'DEV'

export const CHAIN_IDS = {
  1337: 'Ganache Local',
  42: 'Kovan',
  4: 'Rinkeby',
  5: 'Goerli'
}

const config = {
  DEV: {
    CHAIN_ID: 1337,
    tokenAbi: localTokenAbi,
    pricingAbi: localPricingAbi,
    LITHIUM_TOKEN_ADDRESS: localConfig.LithiumTokenAddress,
    LITHIUM_PRICING_ADDRESS: localConfig.LithiumPricingAddress,
    LITHIUM_SUBGRAPH: "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract",
    getTxExplorerUrl: (txHash) => `https://etherscan.io/tx/${txHash}`
  },
  RINKEBY: {
    CHAIN_ID: 4,
    tokenAbi: rinkebyTokenAbi,
    pricingAbi: rinkebyPricingAbi,
    LITHIUM_TOKEN_ADDRESS: rinkebyConfig.LithiumTokenAddress,
    LITHIUM_PRICING_ADDRESS: rinkebyConfig.LithiumPricingAddress,
    LITHIUM_SUBGRAPH: "https://api.studio.thegraph.com/query/4730/lithium-finance/v0.0.21",
    getTxExplorerUrl: (txHash) => `https://rinkeby.etherscan.io/tx/${txHash}`
  },
  GOERLI: {
    CHAIN_ID: 5,
    tokenAbi: goerliTokenAbi,
    pricingAbi: goerliPricingAbi,
    LITHIUM_TOKEN_ADDRESS: goerliConfig.LithiumTokenAddress,
    LITHIUM_PRICING_ADDRESS: goerliConfig.LithiumPricingAddress,
    LITHIUM_SUBGRAPH: "https://api.studio.thegraph.com/query/4730/lithium-finance/v0.0.19",
    getTxExplorerUrl: (txHash) => `https://goerli.etherscan.io/tx/${txHash}`
  }
}


export default config[lithiumEnv]