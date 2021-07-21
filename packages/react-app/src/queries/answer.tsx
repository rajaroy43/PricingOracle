import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Answer } from 'lithium-subgraph'
import { QueryResponse } from './common'
import { AnswerView } from '../types/answer';
import { selectAnswer } from '../selectors/answer';

interface AnswerQueryVars {
  answerId: string
}

interface GetAnswerData {
  answer: Answer
}

export const GET_ANSWER = gql`
  query answer($answerId: ID!) {
    answer(id: $answerId) {
      id
      answerer {
        id
      }
      question {
        id
        answerSet
      }
      answerIndex
      stakeAmount
      status
    }
  }
`;

interface GetAnswerResponse extends QueryResponse {
  answer: AnswerView | null
}

export const useGetAnswer = (client: any, questionId: string, userId: string): GetAnswerResponse => {
  userId = userId.split('').map(f => f.toLowerCase()).join('')
  const answerId = `${questionId}-${userId}`
  const {loading, error, data} = useQuery<GetAnswerData, AnswerQueryVars>(
    GET_ANSWER,
    {
      client,
      variables: { answerId },
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    answer: data != null ? selectAnswer(data.answer) : null
  } 
}



