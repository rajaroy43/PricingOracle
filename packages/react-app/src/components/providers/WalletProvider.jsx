import React, { createContext, useReducer, useMemo } from 'react'

const UPDATE_TYPES = {
  SET_WALLET_TYPE: 'SET_WALLET_TYPE',
  SET_WALLET: 'SET_WALLET'
}

const initialState = {
  walletType: null,
  wallet: null,
  address: null,
  provider: null
}

const reducer = (state, action) => {
  switch(action.type) {
    case UPDATE_TYPES.SET_WALLET:
    return {
        ...state,
        walletType: action.payload.walletType,
        wallet: action.payload.wallet,
        address: action.payload.address,
        provider: action.payload.provider,
        lithiumTokenInstance: action.payload.tokenInstance,
        lithiumPricingInstance: action.payload.pricingInstance
      }
    default:
      return state
  }
}

export const WalletContext = createContext(null)

const WalletProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const contextValue = useMemo(() => {
    return {
      ...state,
      setWallet: ({ walletType, wallet, address, pricingInstance, tokenInstance, provider }) =>
        dispatch({
          type: UPDATE_TYPES.SET_WALLET,
          payload: {
            walletType,
            wallet,
            address,
            pricingInstance,
            tokenInstance,
            provider 
          }
        })
    };
  }, [state, dispatch]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider