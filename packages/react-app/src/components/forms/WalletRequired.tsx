import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ConnectWalletFlow from './connectWallet/ConnectWalletFlow';

const useStyles = makeStyles(theme => ({
    connectContainer: {
      alignItems: 'center',  
      display: 'flex',
      flexDirection: 'column',
      marginTop: '12px',
      width: 'fit-content',
      '& p': {
        fontWeight: 700
      },
    }
}));

const WalletRequired = () => {
    const classes = useStyles();

    return (
        <div className={classes.connectContainer}>
            <p>This page requires a connected wallet</p>
            <ConnectWalletFlow />
        </div>
    )
}

export default WalletRequired