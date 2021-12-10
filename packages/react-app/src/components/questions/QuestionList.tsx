import React from 'react'
import Typography from "@material-ui/core/Typography"
import { QuestionView } from '../../types/question'
import QuestionItem from './QuestionItem'

const QuestionList = ({questions}: {questions: QuestionView[]}) => {
  return (
    <div>
      <Typography variant="h3">Latest Questions:</Typography>
      <br />
      {questions.length ?
        questions.map((question => <QuestionItem id={question.id} question={question} key={question.id} />))
        :
        <div>No Questions</div>
      }
    </div>
  )
}

export default QuestionList