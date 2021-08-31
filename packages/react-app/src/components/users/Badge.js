import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

import Blockie from '../atoms/Blockie'
import Address from '../atoms/Address'
import Box from '../atoms/Box'
import Link from '../atoms/Link'

const useStyles = makeStyles(theme => ({
  badgeAddress: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 500,
    marginLeft: '8px'
  },
  nodeType: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    margin: 0
  }
}));

const Badge = ({ address }) => {
  const classes = useStyles();

  if (!address) {
    return null
  }

  return (
      <Link to={`/wisdomnode/account/${address}`} element={<Box style={{margin: 0, padding: 0}}>
        <Blockie address={address} />
        <div className={classes.badgeAddress} >
          <Address address={address} length={4} />
          { /*
            TODO: Toggle Wisdom Node / Wisdom Seeker 
            */ }
          <p className={classes.nodeType}>Wisdom Node</p>
        </div>
      </Box>
    } />
  )
}

export default Badge