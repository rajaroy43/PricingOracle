import React, { useContext } from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestion } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import { WalletContext } from '../providers/WalletProvider'
import QuestionDetail from '../questions/QuestionDetail'
import Base from './Base'

const Question = ({match}) => {
  const id = match.params.id
  const {loading, question} = useGetQuestion(subgraphClient, id)
  const connectedWallet = useContext(WalletContext)

  return (
    <Base>
     {loading ?
        <LoadingCircle />
        :
        <QuestionDetail question={question} connectedWallet={connectedWallet} />
     }
    </Base>
  )
}

export default Question