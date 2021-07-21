import React from 'react'
import { subgraphClient } from '../../client'
import { useGetAnswer } from '../../queries/answer'
import { QuestionView } from '../../types/question'
import Flex from '../atoms/Flex'
import AnswerQuestionForm from '../forms/AnswerQuestion'

const QuestionAnswer = ({question, connectedWallet}: {question: QuestionView, connectedWallet: any}) => {
  const { loading, answer} = useGetAnswer(subgraphClient, question.id, connectedWallet.address)


  return (
    <Flex flexDirection='column' mb='2em'>
      {loading ?  '-' : answer ?
        'Answered'
        :
        <AnswerQuestionForm
          connectedAddress={connectedWallet.address}
          pricingInstance={connectedWallet.pricingInstance}
          questionId={question.id}
          answerSet={question.answerSet}
        />
      }
    </Flex>
  )
}

export default QuestionAnswer