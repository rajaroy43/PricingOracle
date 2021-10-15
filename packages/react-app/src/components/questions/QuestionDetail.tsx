import React from 'react'
import Typography from "@material-ui/core/Typography"
import { QuestionView } from '../../types/question'
import QuestionInfo from './QuestionInfo'

const QuestionDetail = ({question}: {question: QuestionView}) => {
  return (
    <div>
      <Typography variant="h1">Question #{question.id}</Typography>
      <QuestionInfo question={question} />
    </div>
  )
}

export default QuestionDetail