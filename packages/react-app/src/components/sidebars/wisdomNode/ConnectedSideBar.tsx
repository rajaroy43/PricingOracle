import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { GetNavItemParams, PageParams } from '../../../types/navigation';
import NavMenu from '../../navigation/NavMenu';
import UserProfile from '../../users/UserProfile';

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

// Wisdom Node ConnectedSideBar
const ConnectedSideBar = ({navMenu, getNavItems}: {navMenu: PageParams, getNavItems: GetNavItemParams[]}
  ) => {
  const classes = useStyles();

  return (
    <div className={classes.sidebar}>
      <RouterLink to="/">
        <img src={lithiumLogo} alt="Lithium Finance" className={classes.logo} />
      </RouterLink>
      <div style={{marginTop: '12px'}}>
        <UserProfile walletAddress={navMenu.walletAddress} />
      </div>
      <div>
        <NavMenu {...navMenu} getNavItems={getNavItems} />
      </div>
    </div>
  )
}

export default ConnectedSideBar