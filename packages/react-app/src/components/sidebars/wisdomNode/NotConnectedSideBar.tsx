import React, { useContext }  from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { GetNavItemParams, PageParams } from '../../../types/navigation';
import { WalletContext } from '../../providers/WalletProvider'
import NavMenu from '../../navigation/NavMenu';
import SelectWallet from '../../forms/SelectWallet'

import lithiumLogo from '../../../assets/logo-lithium.svg';

const useStyles = makeStyles(theme => ({
  sidebar: {
    backgroundColor: '#000000',
    border: 0,
    padding: '16px'
  },
  logo: {
    width: '100px'
  }
}));

// Wisdom Node NOT ConnectedSideBar
const NotConnectedSideBar = ({navMenu, getNavItems}: {navMenu: PageParams, getNavItems: GetNavItemParams[]}
  ) => {
  // @ts-ignore
  const { setWallet } = useContext(WalletContext);

  const classes = useStyles();

  return (
    <div className={classes.sidebar}>
      <RouterLink to="/">
        <img src={lithiumLogo} alt="Lithium Finance" className={classes.logo} />
      </RouterLink>
      <div style={{marginTop: '12px'}}>
        <SelectWallet setWallet={setWallet} />
      </div>
      <div>
        <NavMenu {...navMenu} getNavItems={getNavItems} />
      </div>
    </div>
  )
}

export default NotConnectedSideBar