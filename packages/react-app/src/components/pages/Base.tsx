import React from 'react'
import Flex from '../atoms/Flex'
import Box from '../atoms/Box'

const Layout = ({ sideBar, main }: any) =>
  <Flex>
    <Box width='20%'>
      {sideBar}
    </Box>
    <div style={{ display: 'flex', marginTop: '2em', height: 'inherit' }}>
      <div style={{ width: '80%', paddingLeft: '2.5%', marginTop: '2em' }}>
        {main}
      </div>
    </div>
  </Flex>

export default Layout