import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { QuestionView } from '../../types/question'
import Address from '../atoms/Address'
import Flex from '../atoms/Flex'

const QuestionItem = ({id, question}: {id: string, question: QuestionView}) => {
  return (
    <Flex flexDirection='column' mb='2em'>
      <RouterLink to={`/wisdom-node/question/${question.id}`}>
        <div>#{question.id} - {question.description}</div>
      </RouterLink> 
      <div>Asked by <Address address={question.owner.id} length={4} /></div>
      <div>{question.isFinished ? 'Finished' : 'Active'}</div>
    </Flex>
  )
}

export default QuestionItem