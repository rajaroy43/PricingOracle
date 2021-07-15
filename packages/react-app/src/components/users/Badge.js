import React from 'react'
import Blockie from '../atoms/Blockie'
import Address from '../atoms/Address'
import Box from '../atoms/Box'
import Link from '../atoms/Link'


const Badge = ({address, subEl = null, textColor = '#3f51b5'}) => (
  <Link to={`/account/${address}`} element={<Box style={{margin: 0, padding: 0}}>
    <Blockie address={address} />
    <div style={{margin:'0 0 0 0.25em', color: textColor}}>
      <Address address={address} length={4} />
      {subEl}
    </div>
  </Box>
  } />
)

export default Badge