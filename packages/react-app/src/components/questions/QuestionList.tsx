import React from 'react'
import { QuestionView } from '../../types/question'
import QuestionItem from './QuestionItem'

const QuestionList = ({questions}: {questions: QuestionView[]}) => {
  return (
    <div>
      <h3>Questions</h3>
      {questions.length ?
        questions.map((question => <QuestionItem id={question.id} question={question} />))
        :
        <div>No Questions</div>
      }
    </div>
  )
}

export default QuestionList