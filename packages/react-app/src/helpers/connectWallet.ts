import wallets from '../wallets'
import config from '../config'
import { getLithiumPricingInstance, getLithiumTokenInstance } from '../helpers/contractInstances'
import { SUPPORTED_WALLETS } from '../types/user'


export const isValidProviderNetwork = (provider: any): boolean => {
  // confirm  the provider chainId matches if not fortmatic
  if (!provider.isFortmatic && parseInt(provider.chainId, 16) !== config.CHAIN_ID) {
    return false
  }

  return true
}

export const getWalletInstances = async (walletType: SUPPORTED_WALLETS,  wallet: any) => {
  // @ts-ignore
  const address = await wallets[walletType].getAddress(wallet)
  const tokenInstance = getLithiumTokenInstance(wallet)
  const pricingInstance = getLithiumPricingInstance(wallet)
  return {
    address,
    tokenInstance,
    pricingInstance
  }
}

export const connectWallet = async (values: any, setErrors: any) => {
    // @ts-ignore
    const [wallet, provider] = await wallets[values.walletType].connectWallet()

    const isValidNetwork = isValidProviderNetwork( provider )

    if (!isValidNetwork) {
      setErrors({providerNetwork: 'Network Mismatch'})
      return
    }

    const { address, tokenInstance, pricingInstance } = await getWalletInstances(values.walletType, wallet)
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