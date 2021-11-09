import wallets from '../wallets'
import config from '../config'
import { getLithiumPricingInstance, getLithiumTokenInstance } from '../helpers/contractInstances'


const isValidProviderNetwork = (provider: any): boolean => {
  // confirm  the provider chainId matches if not fortmatic
  if (!provider.isFortmatic && parseInt(provider.chainId, 16) !== config.CHAIN_ID) {
    return false
  }

  return true
}

export const connectWallet = async (values: any, setErrors: any) => {
    // @ts-ignore
    const [wallet, provider] = await wallets[values.walletType].connectWallet()

    const isValidNetwork = isValidProviderNetwork( provider )

    if (!isValidNetwork) {
      setErrors({providerNetwork: 'Network Mismatch'})
      return
    }
    // @ts-ignore
    const address = await wallets[values.walletType].getAddress(wallet)
    const tokenInstance = getLithiumTokenInstance(wallet)
    const pricingInstance = getLithiumPricingInstance(wallet)
    const args = {
      walletType: values.walletType,
      wallet,
      address,
      provider,
      tokenInstance,
      pricingInstance
    }

    return args
}