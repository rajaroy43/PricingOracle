import React, { useContext } from 'react'
import { WalletContext } from '../providers/WalletProvider'
import { makeStyles } from '@material-ui/core/styles';
import SelectWallet from "./SelectWallet";

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
    // @ts-ignore
    const { setWallet } = useContext(WalletContext);
    const classes = useStyles();

    return (
        <div className={classes.connectContainer}>
            <p>This page requires a connected wallet</p>
            <SelectWallet setWallet={setWallet} />
        </div>
    )
}

export default WalletRequired