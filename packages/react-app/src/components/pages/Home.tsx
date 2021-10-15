import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestions } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import QuestionList from '../questions/QuestionList'
import MarketingIntro from '../MarketingIntro'

const Home = () => {
  const connectedWallet = useContext(WalletContext)
  const {loading, questions} = useGetQuestions(subgraphClient)

  const sideBarProps = {
    activePage: '',
    // @ts-ignore
    isWalletConnected: !!connectedWallet.wallet,
    // @ts-ignore
    walletAddress: connectedWallet.address
  }

  const main = (
    <WisdomNodeTemplate pageProps={sideBarProps}>
     {loading  ?
        <LoadingCircle />
        :
        questions != null ? <><MarketingIntro /><QuestionList questions={questions} /></>
        :
        'Error Loading Questions'
     }
    </WisdomNodeTemplate>
  )
  return  main;
}

export default Home