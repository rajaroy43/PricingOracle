import React from 'react'
import { AnswerView } from '../../types/answer'
import AnswerItem from './AnswerItem'

const AnswerList = ({answers}: {answers: AnswerView[]}) => {
  return (
    <div>
      <h3>Answers</h3>
      {answers.length ?
        answers.map((answer => <AnswerItem id={answer.id} answer={answer} />))
        :
        <div>No Answers</div>
      }
    </div>
  )
}

export default AnswerList