import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestions } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import QuestionList from '../questions/QuestionList'
import Base from './Base'
import SideBar from './SideBar'

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
    <div>
           <h1>Lithium Finance</h1>
     {loading  ?
        <LoadingCircle />
        :
        questions != null ? <QuestionList questions={questions} />
        :
        'Error Loading Questions'
     }
    </div>
  )
  return <Base main={main} sideBar={<SideBar {...sideBarProps} />} />
}

export default Home