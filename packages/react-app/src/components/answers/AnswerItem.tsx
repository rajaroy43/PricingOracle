import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { AnswerView } from '../../types/answer'
import Flex from '../atoms/Flex'

const AnswerItem = ({id, answer}: {id: string, answer: AnswerView}) => {
  return (
    <Flex flexDirection="column" mb="2em">
      <RouterLink to={`/question/${answer.question.id}`}>
        <div>Question #{answer.question.id}</div>
      </RouterLink>
      
    </Flex>
  )
}

export default AnswerItem