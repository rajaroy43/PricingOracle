import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestion } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import WisdomNodeTemplate from '../templates/WisdomNodeTemplate'
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
    <WisdomNodeTemplate pageProps={sideBarProps}>
      {loading ?
          <LoadingCircle />
          :
          <QuestionDetail question={question} />
      }
    </WisdomNodeTemplate>
  )
  return main;
}

export default Question