import React, { createContext, useReducer, useMemo, useEffect } from 'react'
import { getWalletInstances } from '../../helpers/connectWallet'
import { ConnectedWallet, ConnectedWalletProps, SUPPORTED_WALLETS } from '../../types/user'
import wallets from '../../wallets'

const UPDATE_TYPES = {
  SET_WALLET_TYPE: 'SET_WALLET_TYPE',
  SET_WALLET: 'SET_WALLET',
  DISCONNECT_WALLET: 'DISCONNECT_WALLET'
}

const initialState: ConnectedWallet = {
  wallet: {
    walletType: undefined,
    wallet: null,
    address: undefined,
    provider: null
  },
  updaters: {
    setWallet: () => {},
    disconnectWallet: () => {}
  }
}

const setWalletLocalStorage = (walletType: SUPPORTED_WALLETS, address: string) => {
  // set wallet type and address so we can reconnect on page load
  localStorage.setItem('walletType', walletType);
  localStorage.setItem('address', address);
}

const disconnectWallet = () => {
  // on disconnect, remove local storage cookie and reset wallet provider state
  localStorage.removeItem('walletType')
  localStorage.removeItem('address')
}

const reducer = (state: ConnectedWallet, action: any) => {
  switch(action.type) {
    case UPDATE_TYPES.SET_WALLET:
      setWalletLocalStorage(action.payload.walletType, action.payload.address)
      return {
        ...state,
        wallet: {
          ...action.payload
        }
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

export const WalletContext = createContext<ConnectedWallet>(initialState)

const getLocalState = async () => {
  if (!localStorage) return null

  // read wallet type and address from local storage
  const walletType = await localStorage.getItem('walletType')
  const address = await localStorage.getItem('address')

  if (!walletType || !address) {
    return null
  } else {
    // reconnect to get wallet and provider api
    // @ts-ignore
    const [ wallet, provider ] = await wallets[walletType].connectWallet()
    // @ts-ignore
    const { tokenInstance, pricingInstance } = await getWalletInstances(walletType, wallet)

    return {
      walletType,
      wallet,
      address,
      provider,
      pricingInstance,
      tokenInstance
    }
  }
}

const WalletProvider = ({children}:{children: React.ComponentType} ) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // on page load check if there is local storage cookie
  // if so, reconnect so wallet state can survive page reload
  useEffect(() => {
    const init = async () => {
      const walletState = await getLocalState()

      if (walletState)  {
        dispatch({type: 'SET_WALLET', payload: walletState})
      }

      if (
        typeof window !== 'undefined' &&
        // @ts-ignore
        typeof window.ethereum !== 'undefined' &&
        walletState
      ) {
        // @ts-ignore
        window.ethereum.on('accountsChanged', (accounts: any) => {
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
      updaters: {
        setWallet: (payload: ConnectedWalletProps) => {
          dispatch({
            type: UPDATE_TYPES.SET_WALLET,
            payload
        })},
        disconnectWallet: () => {
          dispatch({ type: 'DISCONNECT_WALLET', payload: {}})
        }
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