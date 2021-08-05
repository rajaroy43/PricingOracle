import React, { Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom';
import ConnectedWallet from '../users/ConnectedWallet';


const Header = () => {
  return (
    <Fragment>
      <RouterLink to="/">
        <div style={{ marginTop: '1em'}}>Lithium Finance</div>
      </RouterLink>
      <div style={{marginLeft: 'auto'}}>
        <ConnectedWallet />
      </div>
  </Fragment>
  )
}

export default Header