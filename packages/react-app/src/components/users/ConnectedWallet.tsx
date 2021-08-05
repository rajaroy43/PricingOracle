import React, { useContext } from 'react'
import Box from '../atoms/Box'
import { WalletContext } from '../providers/WalletProvider'
import SelectWallet from '../forms/SelectWallet'
import Badge from './Badge'

const ConnectedWallet = ({style}: any) => {
  // @ts-ignore
  const { wallet, setWallet, address } = useContext(WalletContext)
  // @ts-ignore
  const status = wallet ? <Badge address={address} textColor='#black' /> : <SelectWallet setWallet={setWallet} />
  return (
    <Box style={style}>
      {status}
    </Box>
  )
}

export default ConnectedWallet