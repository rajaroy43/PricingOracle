import React from 'react'
import { QuestionGroupView } from '../../types/questionGroup'
import Flex from '../atoms/Flex'

const QuestionGroupItem = ({questionGroup}: {questionGroup: QuestionGroupView}) => {
  return (
    <Flex flexDirection='column' mb='2em'>
      <div>#{questionGroup.id} - {questionGroup.questions.length} Questions</div>
    </Flex>
  )
}

export default QuestionGroupItem