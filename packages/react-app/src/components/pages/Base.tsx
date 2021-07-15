import React, {Fragment} from 'react'
import Flex from '../atoms/Flex'
import Box from '../atoms/Box'
import Topbar from './Header'

const Layout = ({ children }: any) =>
  <div>
    <Flex>
      <Box>
        <Topbar />
      </Box>
    </Flex>
    <div style={{ display: 'flex', marginTop: '2em', height: 'inherit' }}>
      <div style={{ width: '80%', paddingLeft: '2.5%', marginTop: '2em' }}>
        {children}
      </div>
    </div>
  </div>

export default Layout