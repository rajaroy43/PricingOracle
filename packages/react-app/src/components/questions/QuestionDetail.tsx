import React from 'react'
import { QuestionView } from '../../types/question'
import QuestionAnswer from './QuestionAnswer'
import QuestionInfo from './QuestionInfo'

const QuestionDetail = ({question, connectedWallet}: {question: QuestionView, connectedWallet?: any}) => {
  return (
    <div>
      <h3>Question # {question.id}</h3>
      <QuestionInfo question={question} />
      { connectedWallet.wallet && <QuestionAnswer question={question} connectedWallet={connectedWallet} isFinished={question.isFinished} />}
    </div>
  )
}

export default QuestionDetail