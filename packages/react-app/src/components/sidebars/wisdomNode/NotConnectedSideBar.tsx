import React, { useContext }  from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { NavMenuParams } from '../../../types/navigation';
import { WalletContext } from '../../providers/WalletProvider'
import NavMenu from '../../navigation/NavMenu';
import SelectWallet from '../../forms/SelectWallet'
import lithiumLogo from '../../../assets/logo-lithium.svg';

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

// Wisdom Node NOT ConnectedSideBar
const NotConnectedSideBar = ({pageParams, getNavItems, isDrawerOpen, setDrawerOpen}: NavMenuParams) => {
  // @ts-ignore
  const { setWallet } = useContext(WalletContext);
  const classes = useStyles();

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarTopRow}>
        <RouterLink to="/">
          <img src={lithiumLogo} alt="Lithium Finance" className={classes.logo} />
        </RouterLink>
        { isDrawerOpen ? <IconButton className={classes.mobileMenuButton} onClick={() => setDrawerOpen(!isDrawerOpen)} disableRipple><CloseIcon className={classes.mobileMenuButton} /></IconButton> :
          <IconButton className={classes.mobileMenuButton} onClick={() => setDrawerOpen(!isDrawerOpen)} disableRipple><MenuIcon className={classes.mobileMenuButton} /></IconButton> }
      </div>
      <div style={{marginTop: '12px'}}>
        <SelectWallet setWallet={setWallet} />
      </div>
      <div>
        <NavMenu pageParams={pageParams} getNavItems={getNavItems} isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen}/>
      </div>
    </div>
  )
}

export default NotConnectedSideBar