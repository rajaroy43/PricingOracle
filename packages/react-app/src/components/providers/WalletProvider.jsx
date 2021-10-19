import React, { createContext, useReducer, useMemo, useEffect } from 'react'
import wallets from '../../wallets'

const UPDATE_TYPES = {
  SET_WALLET_TYPE: 'SET_WALLET_TYPE',
  SET_WALLET: 'SET_WALLET',
  DISCONNECT_WALLET: 'DISCONNECT_WALLET'
}

const initialState = {
  walletType: null,
  wallet: null,
  address: null,
  provider: null
}

const setWalletLocalStorage = (walletType, address) => {
  // set wallet type and address so we can reconnect on page load
  localStorage.setItem('walletType', walletType);
  localStorage.setItem('address', address);
}

const disconnectWallet = () => {
  // on disconnect, remove local storage cookie and reset wallet provider state
  localStorage.removeItem('walletType')
  localStorage.removeItem('address')
}

const reducer = (state, action) => {
  switch(action.type) {
    case UPDATE_TYPES.SET_WALLET:
      setWalletLocalStorage(action.payload.walletType, action.payload.address)
      return {
        ...state,
        walletType: action.payload.walletType,
        wallet: action.payload.wallet,
        address: action.payload.address,
        provider: action.payload.provider,
        tokenInstance: action.payload.tokenInstance,
        pricingInstance: action.payload.pricingInstance,
        disconnectWallet: action.payload.disconnectWallet
      }
    case UPDATE_TYPES.DISCONNECT_WALLET:
      disconnectWallet()
      return {
        ...initialState
      }
    default:
      return state
  }
}

export const WalletContext = createContext(null)

const getLocalState = async () => {
  if (!localStorage) return null

  // read wallet type and address from local storage
  const walletType = await localStorage.getItem('walletType')
  const address = await localStorage.getItem('address')

  if (!walletType || !address) {
    return null
  } else {
    // reconnect to get wallet and provider api
    const [wallet, provider] = await wallets[walletType].connectWallet()

    return {
      walletType: walletType,
      wallet: wallet,
      address: address,
      provider: provider
    }
  }
}

const WalletProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // on page load check if there is local storage cookie
  // if so, reconnect so wallet state can survive page reload
  useEffect(() => {
    const init = async () => {
      let walletState = await getLocalState()

      if (walletState)  {
        dispatch({type: 'SET_WALLET', payload: walletState})
      }

      if (
        typeof window !== 'undefined' &&
        typeof window.ethereum !== 'undefined' &&
        walletState
      ) {
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length < 1) {
            dispatch({type: 'DISCONNECT_WALLET', payload: {}})
          } else {
            walletState.address = accounts[0]
            dispatch({type: 'SET_WALLET', payload: walletState})
          }
        })
      }
    }
    init()
  }, [])

  const contextValue = useMemo(() => {
    return {
      ...state,
      setWallet: ({ walletType, wallet, address, pricingInstance, tokenInstance, provider }) => {
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
      })},
      disconnectWallet: () => {
        dispatch({ type: 'DISCONNECT_WALLET', payload: {}})
      }
    };
  }, [state, dispatch]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider