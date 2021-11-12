import React, { useContext } from 'react'
import Typography from "@material-ui/core/Typography"
import { WalletContext } from '../providers/WalletProvider'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import AnswerGroupList from '../answers/AnswerGroupList'

const History = () => {
  const {wallet} = useContext(WalletContext)
  const address = wallet.address || ''


  const sideBarProps = {
    activePage: 'history',
    isWalletConnected: !!wallet.wallet,
    walletAddress: wallet.address
  }

  const main = (
    <WisdomNodeTemplate pageProps={sideBarProps}>
      <Typography variant="h1">History / My Answers</Typography>
     {address !== '' ?
        <AnswerGroupList address={address} />
        :
        'Connect Wallet to View History'
     }
    </WisdomNodeTemplate>
  )
  return  main;
}

export default History