import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestions } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import QuestionList from '../questions/QuestionList'

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
        <h1>Lithium Finance</h1>
     {loading  ?
        <LoadingCircle />
        :
        questions != null ? <QuestionList questions={questions} />
        :
        'Error Loading Questions'
     }
    </WisdomNodeTemplate>
  )
  return  main;
}

export default Home