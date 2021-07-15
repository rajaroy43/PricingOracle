import React from 'react'
import { QuestionView } from '../../types/question'

const QuestionItem = ({id, question}: {id: string, question: QuestionView}) => {
  return (
    <div>
      Question #{question.id}
    </div>
  )
}

export default QuestionItem