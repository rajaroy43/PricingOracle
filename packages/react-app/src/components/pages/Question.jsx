import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestion } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import QuestionDetail from '../questions/QuestionDetail'
import Base from './Base'
import SideBar from './SideBar'

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
    <div>
      {loading ?
          <LoadingCircle />
          :
          <QuestionDetail question={question} connectedWallet={connectedWallet} />
      }
    </div>
  )
  return (
    <Base
      main={main}
      sideBar={<SideBar {...sideBarProps} />}
    />
  )

}

export default Question