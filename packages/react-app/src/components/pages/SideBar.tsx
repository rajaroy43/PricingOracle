import React, { Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { NavMenuParams } from '../../types/navigation';
import Box from '../atoms/Box';
import NavMenu from '../navigation/NavMenu';
import ConnectedWallet from '../users/ConnectedWallet';


const SideBar = (props: NavMenuParams) => {
  return (
    <Box flexDirection="column" alignItems="center">
      <RouterLink to="/">
        <div style={{ marginTop: '1em'}}>Lithium Finance</div>
      </RouterLink>
      <div style={{marginTop: '1em'}}>
        <ConnectedWallet />
      </div>
      <div>
        <NavMenu {...props} />
      </div>
  </Box>
  )
}

export default SideBar