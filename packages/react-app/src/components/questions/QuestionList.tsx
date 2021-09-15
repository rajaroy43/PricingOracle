import React from 'react'
import Typography from "@material-ui/core/Typography"
import { QuestionView } from '../../types/question'
import QuestionItem from './QuestionItem'

const QuestionList = ({questions}: {questions: QuestionView[]}) => {
  console.log('questions', questions);
  return (
    <div>
      <Typography variant="h2">Latest Questions Sets:</Typography>
      {questions.length ?
        questions.map((question => <QuestionItem id={question.id} question={question} key={question.id} />))
        :
        <div>No Questions</div>
      }
    </div>
  )
}

export default QuestionList