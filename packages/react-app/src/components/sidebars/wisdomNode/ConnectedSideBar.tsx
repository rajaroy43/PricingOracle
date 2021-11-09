import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { NavMenuParams } from '../../../types/navigation';
import NavMenu from '../../navigation/NavMenu';
import UserProfile from '../../users/UserProfile';
import lithiumLogo from '../../../assets/logo-lithium.svg';
import ToggleMode from '../../../components/navigation/NavMenuMode';

const useStyles = makeStyles(theme => ({
  logo: {
    width: '100px'
  },
  mobileMenuButton: {
    zIndex: 9999 , 
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sidebar: {
    backgroundColor: '#000000',
    border: 0,
    padding: '24px'
  },
  sidebarTopRow: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

// Wisdom Node ConnectedSideBar
const ConnectedSideBar = ({pageParams, getNavItems, isDrawerOpen, setDrawerOpen}: NavMenuParams) => {
  const classes = useStyles();
  const walletAddress = pageParams.walletAddress || '0x0'

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarTopRow}>
        <RouterLink to="/">
          <img src={lithiumLogo} alt="Lithium Finance" className={classes.logo} />
        </RouterLink>
        { isDrawerOpen ? <IconButton className={classes.mobileMenuButton} onClick={() => setDrawerOpen(!isDrawerOpen)} disableRipple><CloseIcon className={classes.mobileMenuButton} /></IconButton> :
          <IconButton className={classes.mobileMenuButton} onClick={() => setDrawerOpen(!isDrawerOpen)} disableRipple><MenuIcon className={classes.mobileMenuButton} /></IconButton> }
      </div>
      <ToggleMode initialMode="node" />
      <div style={{marginTop: '12px'}}>
        <UserProfile walletAddress={walletAddress} mode="node" />
      </div>
      <div>
        <NavMenu pageParams={pageParams} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
      </div>
    </div>
  )
}

export default ConnectedSideBar