import React from 'react'
import { subgraphClient } from '../../client'
import { useGetAnswer } from '../../queries/answer'
import { QuestionView } from '../../types/question'
import Flex from '../atoms/Flex'
import AnswerQuestionForm from '../forms/AnswerQuestion'
import ClaimRewardForm from '../forms/ClaimReward'

const QuestionAnswer = ({question, connectedWallet, isFinished}: {question: QuestionView, connectedWallet: any, isFinished: boolean}) => {
  const { loading, answer} = useGetAnswer(subgraphClient, question.id, connectedWallet.address)

  return (
    <Flex flexDirection='column' mb='2em'>
      {loading ?
        '-'
        :
        answer ?
          isFinished ? 
            answer.status == 'CLAIMED' ?  
              'CLAIMED'
              :
              <ClaimRewardForm
                questionId={question.id}
                pricingInstance={connectedWallet.pricingInstance}
                connectedAddress={connectedWallet.address}
              />
            :
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