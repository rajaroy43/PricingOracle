import React, { useState, useReducer, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../atoms/inputs/buttons/Button';
import SelectWallet from './SelectWallet';
import { WalletContext } from '../../providers/WalletProvider';
import LoadingCircle from '../../atoms/Loading';
import CheckUserRegistered from './CheckUserRegistered';

interface Props {
  triggerText: string;
  trigger?: any;
  triggerColor?: string;
  title: string;
  contentText: string;
  getForm: any;
}

interface StateProps {
  loading: false,
  walletAddress: string | null,
  userRegistered: boolean | null,
  pricingApproved: boolean | null
}
const initialState:StateProps = {
loading: false,
 walletAddress: null,
 userRegistered: null,
 pricingApproved: null
}

const UPDATE_TYPES = {
  WALLET_CONNECTED: 'WALLET_CONNECTED',
  USER_REGISTERED: 'USER_REGISTERED',
  PRICING_APPROVED: 'PRICING_APPROVED',
  LOADING: 'LOADING'
}

function reducer(state: StateProps, action: any) {
  switch (action.type) {
    case UPDATE_TYPES.LOADING:
      return {...state, loading: action.loading}
    case UPDATE_TYPES.WALLET_CONNECTED:
      return {...state, walletAddress: action.address}
    case UPDATE_TYPES.USER_REGISTERED:
      return {...state, userRegistered: action.userRegistered}
    case UPDATE_TYPES.PRICING_APPROVED:
        return {...state, pricingAppoved: action.pricingApproved}
    default:
      return state;
  }
}

export default function ConnectWalletFlow() {
  const walletContext = useContext(WalletContext);

  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState)

  const updateWalletConnected = (address: string) => dispatch({type: UPDATE_TYPES.WALLET_CONNECTED, address})
  const updateUserRegistered = () => dispatch({type: UPDATE_TYPES.USER_REGISTERED, userRegistered: true})
  const updatePricingApproved = () => dispatch({type: UPDATE_TYPES.PRICING_APPROVED, pricingApproved: true})
  const updatePricingNotApproved = () => dispatch({type: UPDATE_TYPES.PRICING_APPROVED, pricingApproved: false})

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    updateWalletConnected(wallet.address)
  }

  const handleUserRegistered = (user: any) => {
    updateUserRegistered()
  }

  let content
console.log(`inside flow ${walletContext.address} ${JSON.stringify(state, null, 2)}`)
if ( state.walletAddress === null) {
    content = (
      <SelectWallet
        setWallet={walletContext.updaters.setWallet}
        updaters = {{
          ...updaters,
          onSuccess: handleWalletConnected
        }}
      />
    )
  } else if (state.walletAddress != null) {
    content = (
      <CheckUserRegistered
        address={state.walletAddress}
        onSuccess={handleUserRegistered}
        close={handleClose}
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