import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestions } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import CreateQuestionGroup from '../CreateQuestionGroup'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'

const Admin = () => {
  const connectedWallet = useContext(WalletContext)
  const { loading } = useGetQuestions(subgraphClient)
  const sideBarProps = {
    activePage: '',
    // @ts-ignore
    isWalletConnected: !!connectedWallet.wallet,
    // @ts-ignore
    walletAddress: connectedWallet.address
  }
  const main = (
    <WisdomNodeTemplate pageProps={sideBarProps}>
      <h1>Lithium Finance</h1>
     {loading 
        ? <LoadingCircle />
        : <div>
            {/* @ts-ignore */}
            <CreateQuestionGroup connectedAddress={connectedWallet.address} pricingInstance={connectedWallet.pricingInstance} />
        </div>
     }
    </WisdomNodeTemplate>
  )
  return main
}

export default Admin