import React  from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { NavMenuParams } from '../../types/navigation';
import NavMenu from '../navigation/NavMenu';
import ConnectedWallet from '../users/ConnectedWallet';

import lithiumLogo from '../../assets/logo-lithium.svg';

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

const SideBar = (props: NavMenuParams) => {
  const classes = useStyles();

  return (
    <div className={classes.sidebar}>
      <RouterLink to="/">
        <img src={lithiumLogo} alt="Lithium Finance" className={classes.logo} />
      </RouterLink>
      <div style={{marginTop: '12px'}}>
        <ConnectedWallet />
      </div>
      <div>
        <NavMenu {...props} />
      </div>
    </div>
  )
}

export default SideBar