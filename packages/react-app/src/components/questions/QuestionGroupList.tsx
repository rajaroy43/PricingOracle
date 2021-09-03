import React from 'react'
import { QuestionGroupView } from '../../types/questionGroup'
import QuestionGroupItem from './QuestionGroupItem'

const QuestionList = ({questionGroups}: {questionGroups: QuestionGroupView[]}) => {
  return (
    <div>
      <h3>Question Groups</h3>
      {questionGroups.length ?
        questionGroups.map((question => <QuestionGroupItem questionGroup={question} key={question.id} />))
        :
        <div>No Question Groups</div>
      }
    </div>
  )
}

export default QuestionList