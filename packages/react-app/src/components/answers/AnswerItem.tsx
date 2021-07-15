import React from 'react'
import { AnswerView } from '../../types/answer'

const AnswerItem = ({id, answer}: {id: string, answer: AnswerView}) => {
  return (
    <div>
      Answer #{answer.id}
    </div>
  )
}

export default AnswerItem