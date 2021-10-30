import React, { useState, useReducer, useContext } from 'react';
import { BigNumber } from 'ethers';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../atoms/inputs/buttons/Button';
import SelectWallet from './SelectWallet';
import { WalletContext } from '../../providers/WalletProvider';
import CheckUserRegistered from './CheckUserRegistered';
import ApproveLithiumPricingForm from './ApproveLithiumPricing';

interface Props {
  triggerText: string;
  trigger?: any;
  triggerColor?: string;
  title: string;
  contentText: string;
  getForm: any;
}

interface StateProps {
  loading: boolean,
  wallet: any | null,
  userRegistered: boolean,
  pricingApproved: boolean 
}
const initialState:StateProps = {
 loading: false,
 wallet: null,
 userRegistered: false,
 pricingApproved: false
}

const UPDATE_TYPES = {
  WALLET_CONNECTED: 'WALLET_CONNECTED',
  USER_REGISTERED: 'USER_REGISTERED',
  RESET: 'RESET',
  LOADING: 'LOADING'
}

function reducer(state: StateProps, action: any) {
  switch (action.type) {
    case UPDATE_TYPES.LOADING:
      return {...state, loading: action.loading}
    case UPDATE_TYPES.WALLET_CONNECTED:
      return {...state, wallet: action.wallet}
    case UPDATE_TYPES.USER_REGISTERED:
      return {...state, userRegistered: action.userRegistered}
    case UPDATE_TYPES.RESET:
        return {...initialState}
    default:
      return state;
  }
}

export default function ConnectWalletFlow() {
  const walletContext = useContext(WalletContext);

  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, {...initialState})

  const updateWalletConnected = (wallet: any) => dispatch({type: UPDATE_TYPES.WALLET_CONNECTED, wallet})
  const updateUserRegistered = () => dispatch({type: UPDATE_TYPES.USER_REGISTERED, userRegistered: true})
  const reset = () => dispatch({type: UPDATE_TYPES.RESET})

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset()
  };
  const color = "#fff"

  const triggerEl = (
    <Button
      style={{ color }}
      onClick={handleClickOpen}
      label="Connect Wallet"
    />
  )

  const updaters = {
    cancel: handleClose,
    onSuccess: () => {},
    onError: () => {}
  }

  const handleWalletConnected = (wallet: any) => {
    updateWalletConnected(wallet)
  }

  const handleUserRegistered = (user: any) => {
    if (BigNumber.from(user.tokenApprovalBalance).isZero()) {
      updateUserRegistered()
    } else {
      handleClose()
    }

  }

  let content

if ( state.wallet === null) {
    content = (
      <SelectWallet
        setWallet={walletContext.updaters.setWallet}
        updaters = {{
          ...updaters,
          onSuccess: handleWalletConnected
        }}
      />
    )
  } else if (state.wallet != null && state.userRegistered === false) {
    content = (
      <CheckUserRegistered
        address={state.wallet.address}
        onSuccess={handleUserRegistered}
        close={handleClose}
      />
    )
  } else if (state.wallet != null && state.userRegistered === true) {
    content = (
      <ApproveLithiumPricingForm
        wallet={state.wallet}
        updaters = {{
          ...updaters
        }}
      />
    )
  }

  return (
    <div >
      {triggerEl}

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Connect Your Wallet</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
      </Dialog>
    </div>
  );
}