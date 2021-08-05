import React from 'react'
import { QuestionView } from '../../types/question'
import Address from '../atoms/Address'
import Flex from '../atoms/Flex'

const QuestionItem = ({question}: {question: QuestionView}) => {
  return (
    <Flex flexDirection='column' mb='2em'>
      <div>{question.description}</div>
      <Flex>Asked by <Address address={question.owner.id} length={4} /></Flex>
      <div>{question.isFinished ? 'Finished' : 'Active'}</div>
      <div>Bounty: {question.bountyDisplay}</div>
      <div>Total Staked: {question.totalStakedDisplay}</div>
      {question.isFinished &&
        <div>
          Final Answer: {question.topAnswerDisplay}
        </div>
      }
    </Flex>
  )
}

export default QuestionItem