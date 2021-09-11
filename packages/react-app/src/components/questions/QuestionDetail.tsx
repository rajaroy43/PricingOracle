import React from 'react'
import Typography from "@material-ui/core/Typography"
import { QuestionView } from '../../types/question'
import QuestionAnswer from './QuestionAnswer'
import QuestionInfo from './QuestionInfo'

const QuestionDetail = ({question, connectedWallet}: {question: QuestionView, connectedWallet?: any}) => {
  return (
    <div>
      <Typography variant="h1">Question # {question.id}</Typography>
      <QuestionInfo question={question} />
      { connectedWallet.wallet && <QuestionAnswer question={question} connectedWallet={connectedWallet} isFinished={question.isFinished} />}
    </div>
  )
}

export default QuestionDetail