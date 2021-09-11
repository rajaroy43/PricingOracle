import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
import QuestionGroupList from '../questions/QuestionGroupList'
import { useGetActiveQuestionGroups } from '../../queries/questionGroup'

const AvailableQuestions = () => {
  const connectedWallet = useContext(WalletContext)
  const {loading, questionGroups} = useGetActiveQuestionGroups(subgraphClient)
  console.log(`got question group ${questionGroups}`)
  const sideBarProps = {
    activePage: 'availableQuestions',
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
        questionGroups != null ?
          <QuestionGroupList questionGroups={questionGroups} />
          :
          'Error Loading Question Groups'
     }
    </WisdomNodeTemplate>
  )
  return  main;
}

export default AvailableQuestions