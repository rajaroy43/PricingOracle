import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestion } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import Template from '../../components/Template'
import QuestionDetail from '../questions/QuestionDetail'

const Question = ({match}) => {
  const id = match.params.id
  const {loading, question} = useGetQuestion(subgraphClient, id)
  const connectedWallet = useContext(WalletContext)
  const sideBarProps = {
    activePage: 'question',
    // @ts-ignore
    isWalletConnected: !!connectedWallet.wallet,
    // @ts-ignore
    walletAddress: connectedWallet.address
  }
  
  const main = (
    <Template {...sideBarProps}>
      {loading ?
          <LoadingCircle />
          :
          <QuestionDetail question={question} connectedWallet={connectedWallet} />
      }
    </Template>
  )
  return main;

}

export default Question