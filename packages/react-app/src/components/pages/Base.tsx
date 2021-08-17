import React from 'react'
import Flex from '../atoms/Flex'
import Box from '../atoms/Box'

const Layout = ({ sideBar, main }: any) =>
  <Flex>
    <Box width='20%'>
      {sideBar}
    </Box>
    <div style={{ display: 'flex', marginTop: '1px', height: 'inherit' }}>
      {main}
    </div>
  </Flex>

export default Layout