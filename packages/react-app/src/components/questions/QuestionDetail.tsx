import React from 'react'
import { subgraphClient } from '../../client'
import { useGetAnswer } from '../../queries/answer'
import { QuestionView } from '../../types/question'
import QuestionAnswer from './QuestionAnswer'
import QuestionInfo from './QuestionInfo'

const QuestionDetail = ({question, connectedWallet}: {question: QuestionView, connectedWallet?: any}) => {
  return (
    <div>
      <h3>Question # {question.id}</h3>
      <QuestionInfo question={question} />
      {!question.isFinished && connectedWallet.wallet && <QuestionAnswer question={question} connectedWallet={connectedWallet} />}
    </div>
  )
}

export default QuestionDetail