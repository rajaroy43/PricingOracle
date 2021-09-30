import React from 'react'
import { subgraphClient } from '../../client'
import { useGetAnswer } from '../../queries/answer'
import { QuestionView } from '../../types/question'
import Flex from '../atoms/Flex'

const QuestionAnswer = ({question, connectedWallet, isFinished}: {question: QuestionView, connectedWallet: any, isFinished: boolean}) => {
  const { loading, answer} = useGetAnswer(subgraphClient, question.id, connectedWallet.address)
  return (
    <Flex flexDirection='column' mb='2em'>
      {loading ?
        '-'
        :
        answer ?
          isFinished ? 
            'Not Answered'
            :
            'Answered'
          :
          'Not Answered'
      }
    </Flex>
  )
}

export default QuestionAnswer