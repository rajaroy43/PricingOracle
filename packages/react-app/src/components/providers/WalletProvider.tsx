import React, { createContext, useReducer, useMemo } from "react"
import { ConnectedWallet } from "../../types/user"

enum ACTION_TYPES {
  SET_WALLET = "SET_WALLET"
}

// An interface for our actions
interface WalletAction {
  type: ACTION_TYPES;
  payload: ConnectedWallet;
}

type ACTIONS = WalletAction

const initialState: ConnectedWallet = {
  walletType: undefined,
  wallet: null,
  address: undefined,
  provider: null,
  tokenInstance: null,
  pricingInstance: null,
  updaters: {
    setWallet: () => {}
  }
}

const reducer = (state: ConnectedWallet, action: ACTIONS) => {
  switch(action.type) {
    case ACTION_TYPES.SET_WALLET:
    return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export const WalletContext = createContext<ConnectedWallet>(initialState)

const WalletProvider = ({children}: {children: React.ComponentType}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const updaters = {
    setWallet: (wallet: ConnectedWallet) =>
      dispatch({
        type: ACTION_TYPES.SET_WALLET,
        payload: wallet
      })
  }

  const contextValue = useMemo(() => {
    return {
      ...state,
      updaters
    };
  }, [state, dispatch]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider