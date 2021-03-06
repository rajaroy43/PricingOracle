import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestions } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import CreateQuestionGroup from '../forms/createQuestionGroup/CreateQuestionGroup'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'

const Admin = () => {
  const {wallet} = useContext(WalletContext)
  const { loading } = useGetQuestions(subgraphClient)
  const sideBarProps = {
    activePage: '',
    isWalletConnected: !!wallet,
    walletAddress: wallet ? wallet.address : undefined
  }
  const main = (
    <WisdomNodeTemplate pageProps={sideBarProps}>
      <h1>Lithium Finance</h1>
      {loading ? 
        <LoadingCircle />
        :
        wallet ?
          <CreateQuestionGroup wallet={wallet} />
          :
          <p style={{ color: 'white' }}>Please Connect to Metamask</p>
      }
    </WisdomNodeTemplate>
  )
  return main
}

export default Admin