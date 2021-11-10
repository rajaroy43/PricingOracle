import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestions } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import CreateQuestionGroup from '../forms/CreateQuestionGroup'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'

const Admin = () => {
  const {wallet} = useContext(WalletContext)
  const { loading } = useGetQuestions(subgraphClient)
  const sideBarProps = {
    activePage: '',
    isWalletConnected: !!wallet.wallet,
    walletAddress: wallet.address
  }
  const main = (
    <WisdomNodeTemplate pageProps={sideBarProps}>
      <h1>Lithium Finance</h1>
     {loading 
        ? <LoadingCircle />
        : <div>
            <CreateQuestionGroup connectedAddress={wallet.address} pricingInstance={wallet.pricingInstance} />
        </div>
     }
    </WisdomNodeTemplate>
  )
  return main
}

export default Admin